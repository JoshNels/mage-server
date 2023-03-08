/**
 * Contains an arc feature layer url and the event ids that sync to it.
 */
export interface FeatureLayerConfig {

    /**
     * The url to the arc feature layer.
     */
    url: string;

    /**
     * The event ids or names that sync to this arc feature layer.
     */
    events: (number|string)[];
}

/**
 * Attribute configurations
 */
export interface AttributeConfig {

    /**
     * String value concatenation.
     */
    concatenation?: AttributeConcatenationConfig

    /**
     * Value mappings
     */
    mappings?: { [value: string]: any }

}

/**
 * Same string attribute concatenation configuration.
 */
export interface AttributeConcatenationConfig {

    /**
     * Delimiter used to combine two string values.
     */
    delimiter: string

    /**
     * Combine attribute values from multiple same forms.
     */
    sameForms?: boolean

    /**
     * Combine attribute values form different forms.
     */
    differentForms?: boolean

}
