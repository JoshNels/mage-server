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
}

export const defaultArcGISPluginConfig = Object.freeze<Required<ArcGISPluginConfig>>({
  enabled: true,
  intervalSeconds: 60,
  batchSize: 100,
  featureLayers: ['https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0',
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1',
  'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2']
})