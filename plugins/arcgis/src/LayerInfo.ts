/**
 * Contains information about a specific arc feature layer.
 */
export class LayerInfo {

    /**
     * The url to the feature layer.
     */
    url: string;

    /**
     * The geometry type this feature layer accepts.
     */
    geometryType: string;

    /**
     * Constructor.
     */
    constructor() {
        this.url = '';
        this.geometryType = '';
    }
}