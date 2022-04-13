import { MageEventAttrs, MageEventId, MageEventRepository } from '@ngageoint/mage.service/lib/entities/events/entities.events'
import { Attachment, AttachmentId, AttachmentStore, Observation, ObservationId, patchAttachment, ObservationRepositoryForEvent, AttachmentPatchAttrs, Thumbnail, PendingAttachmentContentId, EventScopedObservationRepository } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'
import { PluginStateRepository } from '@ngageoint/mage.service/lib/plugins.api'
import path from 'path'

const logPrefix = '[mage.image]'
const console = {
  log: globalThis.console.log.bind(globalThis, logPrefix),
  info: globalThis.console.info.bind(globalThis, logPrefix),
  warn: globalThis.console.warn.bind(globalThis, logPrefix),
  error: globalThis.console.error.bind(globalThis, logPrefix)
}

export interface ImagePluginState {
  /**
   * When true, the plugin will process images.  When false, the plugin will
   * idly contemplate its existence.
   */
  enabled: boolean
  /**
   * Query the database for new image attachments to process at the given
   * repeating time interval in seconds.
   */
  intervalSeconds: number
  /**
   * Limit processing to the given number of image attachments during one
   * interval.  This may be necessary to avoid using too much CPU time just for
   * image processing, potentially affecting server performance.  If the value
   * is `null` or less-than-or-equal-to 0, the plugin will process as many
   * image attachments as the database query yields.
   */
  intervalBatchSize: number
  /**
   * Generate thumbnails by scaling images to the given list of pixel sizes.
   * The plugin scales the lesser of the image's width or height to the target
   * thumbnail size, and scales the greater dimension to the same ratio as the
   * lesser dimension.  The plugin will not scale images when the original
   * image is smaller than the thumbnail size.  An empty array to disable
   * thumbnails.
   */
  thumbnailSizes: number[]
}

export const defaultImagePluginConfig: ImagePluginState = Object.freeze({
  enabled: false,
  intervalSeconds: 60,
  intervalBatchSize: 100,
  autoOrient: true,
  thumbnailSizes: [ 150, 320, 800, 1024, 2048 ],
})

export const initFromSavedState = async (stateRepo: PluginStateRepository<ImagePluginState>) => {
  const state = await stateRepo.get()

}

export interface ImagePluginController {
  setState(config: ImagePluginState): Promise<void>
}




// function start() {
//   // start worker
//   var worker = child.fork(__dirname + '/process');

//   worker.on('error', function(err) {
//     log.error('********************** image plugin error **************************', err);
//     worker.kill();
//     start();
//   });

//   worker.on('exit', function(exitCode) {
//     log.warn('********************** image plugin exit, code **********************', exitCode);
//     if (exitCode !== 0) {
//       start();
//     }
//   });

//   worker.on('uncaughtException', function(err) {
//     log.error('*************************** image plugin uncaught exception *******************', err);
//     worker.kill();
//     start();
//   });

//   process.on('exit', function(err) {
//     log.warn('***************** image plugin parent process exit, killing ********************', err);
//     worker.kill();
//   });
// }

export type EventProcessingState = {
  event: MageEventAttrs,
  latestAttachmentProcessedTimestamp: number
}

function syncProcessingStatesFromAllEvents(allEvents: MageEventAttrs[], states: Map<MageEventId, EventProcessingState> | null | undefined): Map<MageEventId, EventProcessingState> {
  states = states || new Map()
  const newStates = new Map<MageEventId, EventProcessingState>()
  for (const event of allEvents) {
    const state = states.get(event.id) || { event, latestAttachmentProcessedTimestamp: 0 }
    newStates.set(event.id, state)
  }
  return newStates
}

export async function processImageAttachments(
  pluginState: ImagePluginState,
  eventProcessingStates: Map<MageEventId, EventProcessingState> | null,
  findUnprocessedAttachments: FindUnprocessedImageAttachments,
  imageService: ImageService,
  eventRepo: MageEventRepository,
  observationRepoForEvent: ObservationRepositoryForEvent,
  attachmentStore: AttachmentStore,
): Promise<Map<MageEventId, EventProcessingState>> {
  const startTime = Date.now()
  const allEvents = await eventRepo.findActiveEvents()
  eventProcessingStates = syncProcessingStatesFromAllEvents(allEvents, eventProcessingStates)
  const eventLatestModifiedTimes = new Map<MageEventId, number>()
  const unprocessedAttachments = await findUnprocessedAttachments(Array.from(eventProcessingStates.values()), null, startTime, pluginState.intervalBatchSize)
  for await (const unprocessed of unprocessedAttachments) {
    // TODO: check results for errors
    const { observationId, attachmentId } = unprocessed
    const observationRepo = await observationRepoForEvent(unprocessed.eventId)
    const orient = async (observation: Observation) => orientAttachmentImage(observation, attachmentId, imageService, observationRepo, attachmentStore)
    const thumbnail = async (observation: Observation) => thumbnailAttachmentImage(observation, attachmentId, pluginState.thumbnailSizes, imageService, observationRepo, attachmentStore)
    const [ original, processed ] = await observationRepo.findById(observationId)
      .then(checkObservationThen(orient))
      .then(checkObservationThen(thumbnail))
    if (original instanceof Observation && processed instanceof Observation) {
      const eventLatestModified = eventLatestModifiedTimes.get(unprocessed.eventId) || 0
      const attachment = original.attachmentFor(attachmentId)
      const attachmentLastModified = attachment?.lastModified?.getTime() || 0
      if (attachmentLastModified > eventLatestModified) {
        eventLatestModifiedTimes.set(unprocessed.eventId, attachmentLastModified)
      }
    }
    else {
      console.error(`error processing attachment ${unprocessed.attachmentId} on observation ${unprocessed.observationId}:`, original, '\n', processed)
    }
  }
  return new Map<MageEventId, EventProcessingState>(Array.from(eventProcessingStates.entries(), ([ eventId, state ]) => {
    return [ eventId, { event: state.event, latestAttachmentProcessedTimestamp: eventLatestModifiedTimes.get(eventId) || 0 } ]
  }))
}

type ObservationUpdateResult = [ original: Observation | Error | null, updated: Observation | Error | null ]
function checkObservationThen(update: (o: Observation) => Promise<Observation | Error | null>): (target: Observation | Error | null | ObservationUpdateResult) => Promise<ObservationUpdateResult> {
  return async target => {
    const [ original, updated ] = Array.isArray(target) ? target : [ target, target ]
    if (updated instanceof Observation) {
      return await update(updated).then(result => [ original, result ])
    }
    return [ original, updated ]
  }
}

async function orientAttachmentImage (
  observation: Observation,
  attachmentId: AttachmentId,
  imageService: ImageService,
  observationRepo: EventScopedObservationRepository,
  attachmentStore: AttachmentStore
) {
  const attachment = observation.attachmentFor(attachmentId)
  if (!attachment) {
    return new Error(`attachment ${attachmentId} does not exist on observation ${observation.id}`)
  }
  const content = await attachmentStore.readContent(attachmentId, observation)
  if (content instanceof Error) {
    console.error(`error reading content of image attachment ${attachmentId}`, content)
    return content
  }
  const pending = await attachmentStore.stagePendingContent()
  const oriented = await imageService.autoOrient(imageContentForAttachment(attachment, content), pending.tempLocation)
  if (oriented instanceof Error) {
    return oriented
  }
  const patch: AttachmentPatchAttrs = {
    oriented: true,
    contentType: oriented.mediaType,
    size: oriented.sizeInBytes,
    ...oriented.dimensions,
  }
  let updatedObservation = patchAttachment(observation, attachment.id, patch)
  if (updatedObservation instanceof Observation) {
    updatedObservation = await observationRepo.save(updatedObservation)
  }
  else {
    console.error(`error updating oriented attachment ${attachment.id} on observation ${observation.id}:`, updatedObservation)
    return updatedObservation
  }
  const contentError = await attachmentStore.saveContent(pending.id, attachment.id, updatedObservation)
  if (contentError) {
    console.error(`error saving pending oriented content ${pending.id} for attachment ${attachmentId} on observation ${observation.id}:`, contentError)
    return contentError
  }
  return updatedObservation
}

async function thumbnailAttachmentImage(
  observation: Observation, attachmentId: AttachmentId, thumbnailSizes: number[],
  imageService: ImageService, observationRepo: EventScopedObservationRepository, attachmentStore: AttachmentStore): Promise<Error | Observation> {
  const attachment = observation.attachmentFor(attachmentId)
  if (!attachment) {
    const message = `attachment ${attachmentId} does not exist on observation ${observation.id}`
    console.error(message)
    return new Error(message)
  }
  const results = await thumbnailSizes.reduce((chain, thumbnailSize) => {
    return chain.then(async results => {
      const result = await generateAndStageThumbnail(thumbnailSize, attachment, observation, imageService, attachmentStore)
      return [ ...results, result ]
    })
  }, Promise.resolve([] as Array<Error | StagedThumbnail>))
  const stagedThumbnails = Array.from(results).filter(result => !(results instanceof Error)) as StagedThumbnail[]
  const attachmentPatch: AttachmentPatchAttrs = {
    thumbnails: stagedThumbnails.map(x => x.thumbnail)
  }
  // TODO: check for save errors
  const updatedObservation = patchAttachment(observation, attachmentId, attachmentPatch) as Observation
  const saved = await observationRepo.save(updatedObservation)
  for (const stagedThumbnail of stagedThumbnails) {
    await attachmentStore.saveThumbnailContent(stagedThumbnail.pendingContentId, stagedThumbnail.thumbnail.minDimension, attachmentId, saved)
  }
  return saved
}

type StagedThumbnail = {
  thumbnail: Thumbnail,
  pendingContentId: PendingAttachmentContentId
}

async function generateAndStageThumbnail(thumbnailSize: number, attachment: Attachment, observation: Observation, imageService: ImageService, attachmentStore: AttachmentStore): Promise<Error | StagedThumbnail> {
  const attachmentId = attachment.id
  const attachmentName = attachment.name || ''
  const attachmentExt = path.extname(attachmentName)
  const attachmentBareName = attachmentName.slice(0, attachmentExt.length - attachmentExt.length) || attachmentId
  const content = await attachmentStore.readContent(attachmentId, observation)
  if (content instanceof Error) {
    const message = `error reading content for observation ${observation.id}, attachment ${attachmentId}: ${content}`
    console.error(message, content)
    return new Error(message)
  }
  const source = imageContentForAttachment(attachment, content)
  const pendingContent = await attachmentStore.stagePendingContent()
  const thumbInfo = await imageService.scaleToDimension(thumbnailSize, source, pendingContent.tempLocation)
  if (thumbInfo instanceof Error) {
    const message = `error scaling image on attachment ${attachmentId}: ${thumbInfo}`
    console.error(message, thumbInfo)
    return new Error(message)
  }
  return {
    thumbnail: {
      name: `${attachmentBareName}-${thumbnailSize}${attachmentExt}`,
      minDimension: thumbnailSize,
      contentType: thumbInfo.mediaType,
      width: thumbInfo.dimensions.width,
      height: thumbInfo.dimensions.height,
      size: thumbInfo.sizeInBytes
    },
    pendingContentId: pendingContent.id
  }
}

function imageContentForAttachment(x: Attachment, bytes: NodeJS.ReadableStream): ImageContent {
  const dimensions = typeof x.width === 'number' && typeof x.height === 'number' ? {
    width: x.width,
    height: x.height
  } : undefined
  return {
    bytes,
    dimensions,
    mediaType: x.contentType,
    sizeInBytes: x.size
  }
}

/**
 * Scale the dimensions of the given attachment to the dimensions of a
 * thumbnail with the given minimum target dimension.  Return null if either of
 * the attachment's dimensions are not numeric.
 * @param attachment
 * @param minThumbDimension
 * @returns
 */
export const thumbnailDimensionsForAttachment = (attachment: Attachment, minThumbDimension: number): { width: number, height: number } | null => {
  if (!attachment.width || attachment.width <= 0 || !attachment.height || attachment.height <= 0) {
    return null
  }
  const [ width, height ] = attachment.width <= attachment.height ?
    [ minThumbDimension, Math.ceil((minThumbDimension / attachment.width) * attachment.height) ] :
    [ Math.ceil((minThumbDimension / attachment.height) * attachment.width), minThumbDimension ]
  return { width, height }
}

export interface UnprocessedAttachmentReference {
  attachmentId: AttachmentId
  observationId: ObservationId
  eventId: MageEventId
}

/**
 * This is an adapter interface that encapsulates querying for observations in
 * the given MAGE events that have unprocessed attachments, as well as the
 * prioritization strategy of the attachments through the order of the returned
 * iterable.
 */
export interface FindUnprocessedImageAttachments {
  (eventProcessingStates: EventProcessingState[], lastModifiedAfter: number | null, lastModifiedBefore: number | null, limit: number | null): Promise<AsyncIterable<UnprocessedAttachmentReference>>
}

export interface ImageService {
  autoOrient(source: ImageContent, dest: NodeJS.WritableStream): Promise<Required<ImageDescriptor> | Error>
  scaleToDimension(minDimension: number, source: ImageContent, dest: NodeJS.WritableStream): Promise<Required<ImageDescriptor> | Error>
}

export interface ImageDescriptor {
  sizeInBytes?: number
  /**
   * IANA standard media type of the image content
   */
  mediaType?: string
  /**
   * The height and width of the image, if known
   */
  dimensions?: { width: number, height: number }
}

export interface ImageContent extends ImageDescriptor {
  bytes: NodeJS.ReadableStream
}

