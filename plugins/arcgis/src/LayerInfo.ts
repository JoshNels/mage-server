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
     * The feature layer fields.
     */
    fields: LayerField[];

    /**
     * Mapping between field names and layer fields.
     */
    layerFields: Map<string, LayerField> = new Map();

    /**
     * The events that are synching to this layer.
     */
    events: Set<string>;

    /**
     * Constructor.
     */
    constructor() {
        this.url = '';
        this.geometryType = '';
        this.fields = [];
        this.events = new Set<string>();
    }

    /**
     * Initialize.
     * @param url The url to the feature layer.
     * @param events The events that are synching to this layer.
     */
    initialize(url: string, events: string[]) {
        this.url = url;
        for(const event of events) {
            this.events.add(event);
        }
        for (const field of this.fields) {
            this.layerFields.set(field.name, field)
        }
    }

    /**
     * Determine if the field is editable.
     * @param field The field name.
     * @return true if editable
     */
    isEditable(field: string): boolean {
        let editable = false
        const layerField = this.layerFields.get(field)
        if (layerField != null) {
            editable = layerField.editable
        }
        return editable
    }

    /**
     * Determine if the layer is enabled for the event.
     * @param event The event.
     * @return true if enabled
     */
    hasEvent(event: string) {
        return this.events.size == 0 || this.events.has(event)
    }

}

/**
 * Contains information about a specific arc feature layer field.
 */
export interface LayerField {
    name: string
    editable: boolean
}