/**
 * Contains an arc feature layer url and the event ids that sync to it.
 */
export interface FeatureLayerConfig {

    /**
     * The url to the arc feature layer.
     */
    url: string;

    /**
     * The event ids that sync to this arc feature layer.
     */
    events: number[];
}
