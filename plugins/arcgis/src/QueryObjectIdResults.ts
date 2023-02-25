import { QueryResultsBase } from "./QueryResultBase";

/**
 * Contains the object id returned from a feature query on an arc server.
 */
export class QueryObjectIdResults extends QueryResultsBase {

    /**
     * Will contain any of the objectIds that match the query if any.
     */
    objectIds: string[] | undefined;
}