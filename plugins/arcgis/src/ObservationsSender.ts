import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
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
    private _url: string;

    /**
     * The full url to the feature layer receiving observations.
     */
    private _urlAdd: string;

    /**
     * The full url to the feature layer receiving updates.
     */
    private _urlUpdate: string;

    /**
     * Used to log to the console.
     */
    private _console: Console;

    /**
     * Used to send the observations to an arc server.
     */
    private _httpClient: HttpClient;

    /**
     * The field that stores the observation id
     */
    private _observationIdField: string;

    /**
     * The attachment base directory
     */
    private _attachmentDirectory: string;

    /**
     * The attachment last modified time tolerance
     */
    private _attachmentModifiedTolerance: number;

    /**
     * Constructor.
     * @param url The url to the feature layer.
     * @param config The plugins configuration.
     * @param console Used to log to the console.
     */
    constructor(url: string, config: ArcGISPluginConfig, console: Console) {
        this._url = url;
        this._urlAdd = this._url + '/addFeatures';
        this._urlUpdate = this._url + '/updateFeatures';
        this._console = console;
        this._httpClient = new HttpClient(console);
        this._observationIdField = config.observationIdField;
        this._attachmentDirectory = environment.attachmentBaseDirectory;
        this._attachmentModifiedTolerance = config.attachmentModifiedTolerance;
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
     * Delete an observation.
     * @param id The observation id.
     */
    sendDelete(id: string) {

        const url = this._url + '/deleteFeatures'

        this._console.info('ArcGIS deleteFeatures url ' + url + ', ' + this._observationIdField + ': ' + id)

        const form = new FormData()
        form.append('where', this._observationIdField + ' LIKE\'' + id + "%\'")
        form.append('f', 'json')

        this._httpClient.sendPostForm(url, form)

    }

    /**
     * Deletes all observations that are apart of a specified event.
     * @param id The event id.
     */
    sendDeleteEvent(id: string) {

        const url = this._url + '/deleteFeatures'

        this._console.info('ArcGIS deleteFeatures url ' + url + ', ' + this._observationIdField + ': ' + id)

        const form = new FormData()
        form.append('where', this._observationIdField + ' LIKE\'%mageEventId ' + id + "\'")
        form.append('f', 'json')

        this._httpClient.sendPostForm(url, form)

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
                                this.queryAndUpdateAttachments(observation, objectId)
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
                this.sendAttachment(attachment, objectId)
            }
        }
    }

    /**
     * Query for and update observation attachments.
     * @param observation The observation.
     * @param objectId The arc object id of the observation.
     */
    private queryAndUpdateAttachments(observation: ArcObservation, objectId: number) {

        // Query for existing attachments
        const queryUrl = this._url + '/' + objectId + '/attachments?f=json'
        this._httpClient.sendGetHandleResponse(queryUrl, (chunk) => {
            this._console.info('ArcGIS response for ' + queryUrl + ' ' + chunk)
            const result = JSON.parse(chunk)
            this.updateAttachments(observation, objectId, result.attachmentInfos)
        })

    }

    /**
     * Update observation attachments.
     * @param observation The observation.
     * @param objectId The arc object id of the observation.
     * @param attachmentInfos The arc attachment infos.
     */
    private updateAttachments(observation: ArcObservation, objectId: number, attachmentInfos: any[]) {

        // Build a mapping between existing arc attachment names and the attachment infos
        let nameAttachments: { [name: string]: any } = {}
        if (attachmentInfos != null) {
            for (const attachmentInfo of attachmentInfos) {
                nameAttachments[attachmentInfo.name] = attachmentInfo
            }
        }

        // Update existing attachments as needed and add new updated observation attachments
        if (observation.attachments != null) {
            for (const attachment of observation.attachments) {

                const fileName = this.attachmentFileName(attachment)

                const existingAttachment = nameAttachments[fileName]
                if (existingAttachment != null) {
                    delete nameAttachments[fileName]
                    // Update the existing attachment if the file sizes do not match or last modified date updated
                    if (attachment.size != existingAttachment.size
                        || attachment.lastModified + this._attachmentModifiedTolerance >= observation.lastModified) {
                        this.updateAttachment(attachment, objectId, existingAttachment.id)
                    }
                } else {
                    // Add the new attachment on the updated observation
                    this.sendAttachment(attachment, objectId)
                }

            }
        }

        // Delete arc attachments that are no longer on the observation
        if (Object.keys(nameAttachments).length > 0) {
            this.deleteAttachments(objectId, Object.values(nameAttachments))
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
     * @param request The attachment request type.
     * @param form The request form data
     */
    private sendAttachmentPost(attachment: ArcAttachment, objectId: number, request: string, form: FormData) {

        if (attachment.contentLocator != null) {

            const url = this._url + '/' + objectId + '/' + request

            const file = path.join(this._attachmentDirectory, attachment.contentLocator!)

            const fileName = this.attachmentFileName(attachment)

            this._console.info('ArcGIS ' + request + ' url ' + url)
            this._console.info('ArcGIS ' + request + ' file ' + fileName + ' from ' + file)

            const readStream = fs.createReadStream(file)

            form.append('attachment', readStream, {
                filename: fileName
            })
            form.append('f', 'json')

            this._httpClient.sendPostForm(url, form)

        }

    }

    /**
     * Delete observation attachments.
     * @param objectId The arc object id of the observation.
     * @param attachmentInfos The arc attachment infos.
     */
    private deleteAttachments(objectId: number, attachmentInfos: any[]){

        const attachmentIds: number[] = []

        for (const attachmentInfo of attachmentInfos) {
            attachmentIds.push(attachmentInfo.id)
        }

        this.deleteAttachmentIds(objectId, attachmentIds)
    }

    /**
     * Delete observation attachments by ids.
     * @param objectId The arc object id of the observation.
     * @param attachmentIds The arc attachment ids.
     */
    private deleteAttachmentIds(objectId: number, attachmentIds: number[]){

        const url = this._url + '/' + objectId + '/deleteAttachments'

        let ids = ''
        for (const id of attachmentIds) {
            if (ids.length > 0) {
                ids += ', '
            }
            ids += id
        }

        this._console.info('ArcGIS deleteAttachments url ' + url + ', ids: ' + ids)

        const form = new FormData()
        form.append('attachmentIds', ids)
        form.append('f', 'json')

        this._httpClient.sendPostForm(url, form)

    }

    /**
     * Determine the attachment file name.
     * @param attachment The observation attachment.
     * @return attachment file name.
     */
    private attachmentFileName(attachment: ArcAttachment): string {

        let fileName = attachment.field + "_" + attachment.name

        const extensionIndex = attachment.contentLocator.lastIndexOf('.')
        if (extensionIndex != -1) {
            fileName += attachment.contentLocator.substring(extensionIndex)
        }

        return fileName
    }

}