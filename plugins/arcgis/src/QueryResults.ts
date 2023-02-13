/**
 * Contains the object id returned from a feature query on an arc server.
 */
export class QueryResults {

    /**
     * Contains the field name of the objectId field.
     */
    objectIdFieldName: string | undefined;

    /**
     * Will contain any of the objectIds that match the query if any.
     */
    objectIds: string[] | undefined;
}