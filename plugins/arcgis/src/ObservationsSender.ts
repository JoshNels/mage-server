import { ArcGISPluginConfig } from './ArcGISPluginConfig';
import { ArcObjects } from './ArcObjects';
import { ArcObservation } from './ArcObservation';
import { HttpClient } from './HttpClient';
import { Attachment } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'
import environment from '@ngageoint/mage.service/lib/environment/env'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data';

/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
export class ObservationsSender {

    /**
     * The base url to the feature layer.
     */
    _url: string;

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
     * The attachment base directory
     */
    _attachmentDirectory: string;

    /**
     * Constructor.
     * @param config The plugins configuration.
     * @param console Used to log to the console.
     */
    constructor(config: ArcGISPluginConfig, console: Console) {
        this._url = config.featureLayers[0];
        this._urlAdd = this._url + '/addFeatures';
        this._urlUpdate = this._url + '/updateFeatures';
        this._console = console;
        this._httpClient = new HttpClient(console);
        this._attachmentDirectory = environment.attachmentBaseDirectory;
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
    private responseHandler(observations: ArcObjects): (chunk: any) => void {
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
                            console.log('Observation id: ' + observation.id + ', Object id: ' + objectId)
                            this.sendAttachments(observation, objectId)
                        }
                    }
                }
            }
        }
    }

    /**
     * Send observation attachments.
     * @param observation The observation.
     * @param objectId The arc object id of the observation.
     */
    private sendAttachments(observation: ArcObservation, objectId: number) {
        if (observation.attachments != null) {
            for (const attachment of observation.attachments) {
                if (attachment.contentLocator != null) {
                    this.sendAttachment(attachment, objectId)
                }
            }
        }
    }

    /**
     * Send an observation attachment.
     * @param attachment The observation attachment.
     * @param objectId The arc object id of the observation.
     */
     private sendAttachment(attachment: Attachment, objectId: number) {

        const url = this._url + '/' + objectId + '/addAttachment?f=json'

        const file = path.join(this._attachmentDirectory, attachment.contentLocator!)

        this._console.info('ArcGIS addAttachment url ' + url)
        this._console.info('ArcGIS addAttachment file ' + attachment.name + ' at ' + file)

        const readStream = fs.createReadStream(file)

        const form = new FormData()
        form.append('attachment', readStream)

        this._httpClient.sendPostForm(url, form)

    }

}