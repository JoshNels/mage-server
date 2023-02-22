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
   * Limit processing to the given number of observations during one
   * interval.  This may be necessary so we do not overload an ArcGIS feature layer.
   */
  batchSize: number

  /**
   * The feature layers to send new observations to.
   */
  featureLayers: string[]

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

}

export const defaultArcGISPluginConfig = Object.freeze<Required<ArcGISPluginConfig>>({
  enabled: true,
  intervalSeconds: 60,
  batchSize: 100,
  featureLayers: ['https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0',
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1',
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2'],
  observationIdField: 'description', // TODO temporary default to use editable 'description' field on arcgis test servers
  eventIdField: 'event_id',
  eventNameField: 'event_name',
  userIdField: 'user_id',
  usernameField: 'username',
  userDisplayNameField: 'user_display_name',
  deviceIdField: 'device_id',
  createdAtField: 'created_at',
  lastModifiedField: 'last_modified',
  attachmentModifiedTolerance: 5000
})