import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { ArcObject } from "./ObservationsTransformer";

/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
export class ObservationsSender {

    /**
     * The url to the add features api for a specific feature layer.
     */
    _url: string;

    /**
     * Used to log to the console.
     */
    _console: Console;

    /**
         * Constructor.
         * @param config The plugins configuration.
         * @param console Used to log to the console.
         */
    constructor(config: ArcGISPluginConfig, console: Console) {
        this._url = config.featureLayers[0] + '/addFeatures';
        this._console = console;
    }

    /**
     * Converts the specified observations into a json string that can be sent to an arcgis server.
     * @param observations The observations to convert.
     * @returns The json string of the observations.
     */
    send(observations: ArcObject[]) {
        const content = { 
            f: 'json', 
            features: observations, 
            gdbVersion: null, 
            rollbackOnFailure: true,
            timeReferenceUnknownClient: false };

        const contentString = JSON.stringify(content);

        this._console.info('ArcGIS addFeatures url ' + this._url);
        this._console.info('ArcGIS addFeatures content ' + contentString);
        fetch(this._url, {
            method: 'POST',
            body: contentString,
            headers: {'Content-Type': 'application/json'} })
            .then((response) => {
                return response.text();
            })
            .then((data) => {
                this._console.info('ArcGIS addFeatures response ' + data);
            });
    }
}