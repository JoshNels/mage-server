import { ArcGISPluginConfig } from './ArcGISPluginConfig';
import { ArcObjects } from './ArcObjects';
import { ArcObservation } from './ArcObservation';
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
    sendAdds(observations: ArcObjects) {
        const contentString = 'gdbVersion=&rollbackOnFailure=true&timeReferenceUnknownClient=false&f=json&features=' + JSON.stringify(observations.objects);

        this._console.info('ArcGIS addFeatures url ' + this._urlAdd);
        this._console.info('ArcGIS addFeatures content ' + contentString);

        let responseHandler = this.responseHandler(observations)
        this._httpClient.sendPostHandleResponse(this._urlAdd, contentString, responseHandler);
    }

    /**
     * Converts the specified observations into a json string that can be sent to an arcgis server and
     * sends them to an arc server for updating.
     * @param observations The observations to convert.
     * @returns The json string of the observations.
     */
    sendUpdates(observations: ArcObjects) {
        const contentString = 'gdbVersion=&rollbackOnFailure=true&timeReferenceUnknownClient=false&f=json&features=' + JSON.stringify(observations.objects);

        this._console.info('ArcGIS updateFeatures url ' + this._urlUpdate);
        this._console.info('ArcGIS updateFeatures content ' + contentString);

        this._httpClient.sendPost(this._urlUpdate, contentString);
    }

    /**
     * Creates an observation response handler.
     * @param observations The observations sent.
     * @returns The response handler.
     */
    responseHandler(observations: ArcObjects): (chunk: any) => void {
        return (chunk: any) => {
            console.log('Response: ' + chunk);
            const response = JSON.parse(chunk)
            const results = response.addResults
            if (results != null) {
                const obs = observations.observations
                for (let i = 0; i < obs.length && i < results.length; i++) {
                    const observation = obs[i]
                    const result = results[i]
                    if (result.success != null && result.success) {
                        const objectId = result.objectId
                        if (objectId != null) {
                            this.sendAttachment(observation, objectId)
                        }
                    }
                }
            }
        }
    }

    /**
     * Send an observation attachment.
     * @param observation The observation.
     * @param objectId The arc object id of the observation.
     */
    sendAttachment(observation: ArcObservation, objectId: number) {
        console.log('Observation id: ' + observation.id + ', Object id: ' + objectId)
        // TODO send attachments
    }

}