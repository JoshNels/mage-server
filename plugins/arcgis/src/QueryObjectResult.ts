import { QueryResultsBase } from "./QueryResultBase";
import { ArcObject } from "./ArcObject"

/**
 * Contains the result from a query on an arc feature layer.
 */
export class QueryObjectResult extends QueryResultsBase {

    /**
     * The features matching the query and their attributes.
     */
    features: ArcObject[];

    /**
     * Constructor.
     */
    constructor() {
        super();
        this.features = [];
    }
}