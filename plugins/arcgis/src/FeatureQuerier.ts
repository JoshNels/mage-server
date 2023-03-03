import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { HttpClient } from "./HttpClient";
import { QueryObjectResult } from "./QueryObjectResult";

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
     * The configuration for this plugin.
     */
    private _config: ArcGISPluginConfig;

    /**
     * Constructor.
     * @param url The url to the feature layer.
     * @param config The plugins configuration.
     * @param console Used to log to the console.
     */
    constructor(url: string, config: ArcGISPluginConfig, console: Console) {
        this._httpClient = new HttpClient(console);
        this._url = url + '/query?f=json&where=' + config.observationIdField + ' LIKE \'';
        this._console = console;
        this._config = config;
    }

    /**
     * Queries for an observations object id stored in the arc layer.
     * @param observationId The id of the observation to query for on the arc feature layer.
     * @param response The function called once the response is received.
     */
    queryObject(observationId: string, response: (result: QueryObjectResult) => void) {
        const queryUrl = this._url + observationId + '%\'&outFields=*';
        this._httpClient.sendGetHandleResponse(queryUrl, (chunk) => {
            this._console.info('ArcGIS response for ' + queryUrl + ' ' + chunk);
            const result = JSON.parse(chunk) as QueryObjectResult;
            response(result);
        });
    }

    /**
     * Queries a specific arc feature layer and retrieves all observation that have been added to it.
     * @param response Function called once query is complete.
     */
    queryAllObservations(response: (result: QueryObjectResult) => void) {
        const queryUrl = this._url + '%' + this._config.idSeperator + '%\'';
        this._httpClient.sendGetHandleResponse(queryUrl, (chunk) => {
            console.info('ArcGIS response for ' + queryUrl + ' ' + chunk);
            const result = JSON.parse(chunk) as QueryObjectResult;
            response(result);
        });
    }
}