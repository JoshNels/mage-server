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
    eventIds: number[];

    /**
     * Constructor.
     */
    constructor() {
        this.url = '';
        this.geometryType = '';
        this.fields = [];
        this.eventIds = [];
    }

    /**
     * Initialize.
     * @param url The url to the feature layer.
     * @param eventIds The events that are synching to this layer.
     */
    initialize(url: string, eventIds: number[]) {
        this.url = url;
        this.eventIds = eventIds;
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
}

/**
 * Contains information about a specific arc feature layer field.
 */
export interface LayerField {
    name: string
    editable: boolean
}