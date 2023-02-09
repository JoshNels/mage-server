import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { ArcObject } from "./ArcObject";
import https from 'https';

/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
export class ObservationsSender {

    /**
     * The host to send observations to.
     */
    _host: string;

    /**
     * The port to send observations at.
     */
    _port: string;

    /**
     * The path to the feature layer to send observations too.
     */
    _path: string;

    /**
     * The full url to the feature layer receiving observations.
     */
    _url: URL;

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
        this._url = new URL(config.featureLayers[0] + '/addFeatures');
        this._host = this._url.host;
        this._port = this._url.port;
        this._path = this._url.pathname;
        this._console = console;
    }

    /**
     * Converts the specified observations into a json string that can be sent to an arcgis server.
     * @param observations The observations to convert.
     * @returns The json string of the observations.
     */
    send(observations: ArcObject[]) {
        const contentString = 'gdbVersion=&rollbackOnFailure=true&timeReferenceUnknownClient=false&f=pjson&features=' + JSON.stringify(observations);

        this._console.info('ArcGIS addFeatures url ' + this._url);
        this._console.info('ArcGIS addFeatures content ' + contentString);

        // An object of options to indicate where to post to
        var post_options = {
            host: this._host,
            port: this._port,
            path: this._path,
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'content-length': Buffer.byteLength(contentString),
                'accept': 'application/json'
            }
        };

        // Set up the request
        var post_req = https.request(post_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });

        // post the data
        post_req.write(contentString);
        post_req.end();
    }
}