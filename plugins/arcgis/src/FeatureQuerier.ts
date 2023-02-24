import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { HttpClient } from "./HttpClient";
import { QueryObjectIdResults } from "./QueryObjectIdResults";

/**
 * Performs various queries on observations for a specific arc feature layer.
 */
export class FeatureQuerier {

    /**
     * Used to query the arc server to figure out if an observation exists.
     */
    private _httpClient: HttpClient;

    /**
     * The query url to find out if an observations exists on the server.
     */
    private _url: string;

    /**
     * Used to log to console.
     */
    private _console: Console;

    /**
     * Constructor.
     * @param url The url to the feature layer.
     * @param config The plugins configuration.
     * @param console Used to log to the console.
     */
    constructor(url: string, config: ArcGISPluginConfig, console: Console) {
        this._httpClient = new HttpClient(console);
        this._url = url + '/query?f=json&where=' + config.observationIdField + ' LIKE\'';
        this._console = console;
    }

    /**
     * Queries for an observations object id stored in the arc layer.
     * @param observationId The id of the observation to query for on the arc feature layer.
     * @param response The function called once the response is received.
     */
    queryObjectId(observationId: string, response: (result: QueryObjectIdResults) => void) {
        const queryUrl = this._url + observationId + '%\'&returnIdsOnly=true';
        this._httpClient.sendGetHandleResponse(queryUrl, (chunk) => {
            this._console.info('ArcGIS response for ' + queryUrl + ' ' + chunk);
            const result = JSON.parse(chunk) as QueryObjectIdResults;
            response(result);
        });
    }
}