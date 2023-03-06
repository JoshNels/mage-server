import { FeatureLayerConfig } from "./FeatureLayerConfig"

/**
 * Contains various configuration values used by the plugin.
 */
export interface ArcGISPluginConfig {

  /**
   * When true, the plugin will process new observations and send them to a configured ArcGIS server.
   */
  enabled: boolean

  /**
   * Query the database for new observations to process at the given
   * repeating time interval in seconds.
   */
  intervalSeconds: number

  /**
   * The interval in seconds to wait before trying to see if we have FeatureLayerProcessors ready
   * to be used.
   */
  startupIntervalSeconds: number

  /**
   * If there are pending updates to observation this is the interval in seconds the processor will wait
   * before running again.
   */
  updateIntervalSeconds: number

  /**
   * Limit processing to the given number of observations during one
   * interval.  This may be necessary so we do not overload an ArcGIS feature layer.
   */
  batchSize: number

  /**
   * The feature layers to send new observations to.
   */
  featureLayers: FeatureLayerConfig[]

  /**
   * Override mappings between event form fields and arc attributes.
   */
  fieldAttributes: any

  /**
   * The field name to save and query the observation id to and from the ArcGIS server.
   */
  observationIdField: string

  /**
  * The event id field attribute name.
  */
  eventIdField: string

  /**
   * The event name field attribute name.
   */
  eventNameField: string

  /**
   * The user id field attribute name.
   */
  userIdField: string

  /**
   * The username field attribute name.
   */
  usernameField: string

  /**
   * The user display name field attribute name.
   */
  userDisplayNameField: string

  /**
   * The device id field attribute name.
   */
  deviceIdField: string

  /**
   * The created at field attribute name.
   */
  createdAtField: string

  /**
   * The last modified field attribute name.
   */
  lastModifiedField: string

  /**
   * The time tolerance in miliseconds to consider an attachment last modified time equal
   * to or after an observation last modified time.
   */
  attachmentModifiedTolerance: number

  /**
   * The keyword used to seperate the observation id and the event id when combined into one field.
   */
  idSeperator: string;

}

export const defaultArcGISPluginConfig = Object.freeze<Required<ArcGISPluginConfig>>({
  enabled: true,
  intervalSeconds: 60,
  startupIntervalSeconds: 1,
  updateIntervalSeconds: 1,
  batchSize: 100,
  featureLayers: [new FeatureLayerConfig('https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0', [45]),
    new FeatureLayerConfig('https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1', [45]),
    new FeatureLayerConfig('https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2', [45])],
  fieldAttributes: {},
  observationIdField: 'description',
  eventIdField: 'description',
  eventNameField: 'event_name',
  userIdField: 'user_id',
  usernameField: 'username',
  userDisplayNameField: 'user_display_name',
  deviceIdField: 'device_id',
  createdAtField: 'created_at',
  lastModifiedField: 'last_modified',
  attachmentModifiedTolerance: 5000,
  idSeperator: ' mageEventId '
})
