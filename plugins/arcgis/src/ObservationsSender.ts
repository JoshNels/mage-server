import { ArcGISPluginConfig } from './ArcGISPluginConfig';
import { ArcObject } from './ArcObject';
import https from 'https';
import { HttpClient } from './HttpClient';

/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
export class ObservationsSender {

    /**
     * The full url to the feature layer receiving observations.
     */
    _urlAdd: string;

    /**
     * The full url to the feature layer receiving updates.
     */
    _urlUpdate: string;

    /**
     * Used to log to the console.
     */
    _console: Console;

    /**
     * Used to send the observations to an arc server.
     */
    _httpClient: HttpClient;

    /**
     * Constructor.
     * @param config The plugins configuration.
     * @param console Used to log to the console.
     */
    constructor(config: ArcGISPluginConfig, console: Console) {
        this._urlAdd = config.featureLayers[0] + '/addFeatures';
        this._urlUpdate = config.featureLayers[0] + '/updateFeatures';
        this._console = console;
        this._httpClient = new HttpClient(console);
    }

    /**
     * Converts the specified observations into a json string that can be sent to an arcgis server and
     * sends them to an arc server for adding.
     * @param observations The observations to convert.
     */
    sendAdds(observations: ArcObject[]) {
        const contentString = 'gdbVersion=&rollbackOnFailure=true&timeReferenceUnknownClient=false&f=pjson&features=' + JSON.stringify(observations);

        this._console.info('ArcGIS addFeatures url ' + this._urlAdd);
        this._console.info('ArcGIS addFeatures content ' + contentString);

        this._httpClient.sendPost(this._urlAdd, contentString);
    }

    /**
     * Converts the specified observations into a json string that can be sent to an arcgis server and
     * sends thme to an arc server for updating.
     * @param observations The observations to convert.
     * @returns The json string of the observations.
     */
    sendUpdates(observations: ArcObject[]) {
        const contentString = 'gdbVersion=&rollbackOnFailure=true&timeReferenceUnknownClient=false&f=pjson&features=' + JSON.stringify(observations);

        this._console.info('ArcGIS updateFeatures url ' + this._urlUpdate);
        this._console.info('ArcGIS updateFeatures content ' + contentString);

        this._httpClient.sendPost(this._urlUpdate, contentString);
    }
}