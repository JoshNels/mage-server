import { ArcObject } from "./ArcObject"

/**
 * Contains the result from a query on an arc feature layer.
 */
export class QueryObjectResult {

    /**
     * Contains the field name of the objectId field.
     */
    objectIdFieldName: string;

    /**
     * The features matching the query and their attributes.
     */
    features: ArcObject[];

    /**
     * Constructor.
     */
    constructor() {
        this.objectIdFieldName = 'objectid';
        this.features = [];
    }
}