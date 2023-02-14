import { ArcObject } from './ArcObject'
import { ObservationId, Attachment } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'

export interface ArcObservation {
    id: ObservationId,
    object: ArcObject,
    attachments: readonly Attachment[]
}
