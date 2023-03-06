/**
 * Contains an arc feature layer url and the event ids that sync to it.
 */
export class FeatureLayerConfig {

    /**
     * The url to the arc feature layer.
     */
    url: string;

    /**
     * The event ids that sync to this arc feature layer.
     */
    events: number[];

    /**
     * Constructor.
     * @param url The url to the arc feature layer.
     * @param events The event ids that sync to this arc feature layer.
     */
    constructor(url: string, events: number[]) {
        this.url = url;
        this.events = events;
    }
}
