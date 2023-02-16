import { ArcGISPluginConfig } from './ArcGISPluginConfig';
import { ArcObjects } from './ArcObjects';
import { ArcObservation, ArcAttachment } from './ArcObservation';
import { HttpClient } from './HttpClient';
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

        let responseHandler = this.addResponseHandler(observations)
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

        let responseHandler = this.updateResponseHandler(observations)
        this._httpClient.sendPostHandleResponse(this._urlUpdate, contentString, responseHandler);
    }

    /**
     * Creates an add observation response handler.
     * @param observations The observations sent.
     * @returns The response handler.
     */
    private addResponseHandler(observations: ArcObjects): (chunk: any) => void {
        return this.responseHandler(observations, false)
    }

    /**
     * Creates an update observation response handler.
     * @param observations The observations sent.
     * @returns The response handler.
     */
    private updateResponseHandler(observations: ArcObjects): (chunk: any) => void {
        return this.responseHandler(observations, true)
    }

    /**
     * Creates an observation response handler.
     * @param observations The observations sent.
     * @param update The update or add flag value.
     * @returns The response handler.
     */
    private responseHandler(observations: ArcObjects, update: boolean): (chunk: any) => void {
        return (chunk: any) => {
            console.log((update ? 'Update' : 'Add') + ' Response: ' + chunk);
            const response = JSON.parse(chunk)
            const results = response[update ? 'updateResults' : 'addResults']
            if (results != null) {
                const obs = observations.observations
                for (let i = 0; i < obs.length && i < results.length; i++) {
                    const observation = obs[i]
                    const result = results[i]
                    if (result.success != null && result.success) {
                        const objectId = result.objectId
                        if (objectId != null) {
                            console.log((update ? 'Update' : 'Add') + ' Features Observation id: ' + observation.id + ', Object id: ' + objectId)
                            if (update) {
                                this.updateAttachments(observation, objectId)
                            } else{
                                this.sendAttachments(observation, objectId)
                            }
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
     * Update observation attachments.
     * @param observation The observation.
     * @param objectId The arc object id of the observation.
     */
    private updateAttachments(observation: ArcObservation, objectId: number) {
        // TODO query for attachments to find needed deletions
        if (observation.attachments != null) {
            for (const attachment of observation.attachments) {
                if (attachment.lastModified != null && attachment.lastModified >= observation.lastModified) {
                    // TODO Determine if new or udpate
                }
            }
        }
    }

    /**
     * Send an observation attachment.
     * @param attachment The observation attachment.
     * @param objectId The arc object id of the observation.
     */
    private sendAttachment(attachment: ArcAttachment, objectId: number) {
        this.sendAttachmentPost(attachment, objectId, 'addAttachment', new FormData())
    }

    /**
     * Update an observation attachment.
     * @param attachment The observation attachment.
     * @param objectId The arc object id of the observation.
     * @param attachmentId The observation arc attachment id.
     */
    private updateAttachment(attachment: ArcAttachment, objectId: number, attachmentId: number) {

        const form = new FormData()
        form.append('attachmentId', attachmentId)

        this.sendAttachmentPost(attachment, objectId, 'updateAttachment', form)

    }

    /**
     * Send an observation attachment post request.
     * @param attachment The observation attachment.
     * @param objectId The arc object id of the observation.
     * @param request The attachment request type
     * @param form The request form data
     */
    private sendAttachmentPost(attachment: ArcAttachment, objectId: number, request: string, form: FormData) {

        const url = this._url + '/' + objectId + '/' + request

        const file = path.join(this._attachmentDirectory, attachment.contentLocator!)

        let filename = attachment.field

        const extensionIndex = file.lastIndexOf('.')
        if (extensionIndex != -1) {
            filename += file.substring(extensionIndex)
        }

        this._console.info('ArcGIS ' + request + ' url ' + url)
        this._console.info('ArcGIS ' + request + ' file ' + filename + ' from ' + file)

        const readStream = fs.createReadStream(file)

        form.append('attachment', readStream, {
            filename: filename
        })
        form.append('f', 'json')

        this._httpClient.sendPostForm(url, form)

    }

}