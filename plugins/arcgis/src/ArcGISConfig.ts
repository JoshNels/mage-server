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

    /**
     * Default values
     */
    defaults?: AttributeDefaultConfig[]

    /**
     * Omit the attribute (including count suffix versions) from ArcGIS adds and updates
     */
    omit?: boolean

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

/**
 * Attribute default value configuration.
 */
export interface AttributeDefaultConfig {

    /**
     * Default value.
     */
    value: any

    /**
     * Conditional attribute equality values when the default applies.
     */
    condition?: AttributeValueConfig[]

}

/**
 * Attribute value configuration.
 */
export interface AttributeValueConfig {

    /**
     * Attribute name.
     */
    attribute: string

    /**
     * Attribute values.
     */
    values: any[]

}
