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
 * Same string field concatenation configuration.
 */
export interface FieldConcatenationConfig {

    /**
     * Delimiter used to combine two string values.
     */
    delimiter: string

    /**
     * Combine field values from multiple same forms.
     */
    sameForms: boolean

    /**
     * Combine field values form different forms.
     */
    differentForms: boolean

}
