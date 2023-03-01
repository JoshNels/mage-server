import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { ObservationAttrs, Attachment } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'
import { User } from '@ngageoint/mage.service/lib/entities/users/entities.users'
import { FormFieldType } from '@ngageoint/mage.service/lib/entities/events/entities.events.forms'
import { Geometry, Point, LineString, Polygon } from 'geojson'
import { ArcObservation, ArcAttachment } from './ArcObservation'
import { ArcGeometry, ArcObject, ArcPoint, ArcPolyline, ArcPolygon } from './ArcObject'
import { EventTransform } from './EventTransform'

/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
export class ObservationsTransformer {

    /**
     * ArcGIS configuration.
     */
    private _config: ArcGISPluginConfig

    /**
     * Used to log to the console.
     */
    private _console: Console

    /**
     * Constructor.
     * @param config The plugins configuration.
     * @param console Used to log to the console.
     */
    constructor(config: ArcGISPluginConfig, console: Console) {
        this._config = config
        this._console = console
    }

    /**
     * Converts the specified observation into an ArcObservation that can be sent to an arcgis server.
     * @param observation The observation to convert.
     * @param transform The Event transform.
     * @param user The MAGE user.
     * @returns The ArcObservation of the observation.
     */
    transform(observation: ObservationAttrs, transform: EventTransform, user: User | null): ArcObservation {
        const arcObject = {} as ArcObject

        this.observationToAttributes(observation, transform, user, arcObject)

        if (observation.geometry != null) {
            const geometry = observation.geometry
            const arcGeometry = this.geometryToArcGeometry(geometry)
            this._console.info('ArcGIS new ' + geometry.type + ' at ' + JSON.stringify(arcGeometry) + ' with id ' + observation.id)
            arcObject.geometry = arcGeometry
        }

        let formIds: { [name: string]: number } = {}
        if (observation.properties != null) {
            formIds = this.propertiesToAttributes(observation.properties, transform, arcObject)
        }

        const arcObservation = this.createObservation(observation)

        arcObservation.createdAt = arcObject.attributes['createdAt']
        arcObservation.lastModified = arcObject.attributes['lastModified']
        arcObservation.object = arcObject
        arcObservation.attachments = this.attachments(observation.attachments, formIds, transform)

        return arcObservation
    }

    /**
     * Creates a base ArcObservation with id and geometry type.
     * @param observation The observation to convert.
     * @returns The ArcObservation of the observation.
     */
    createObservation(observation: ObservationAttrs): ArcObservation {
        const arcObservation = {} as ArcObservation
        arcObservation.id = observation.id
        arcObservation.esriGeometryType = this.esriGeometryType(observation)
        return arcObservation
    }

    /**
     * Converts a mage geometry type to an esri geometry type.
     * @param mageGeometryType The mage geometry type.
     * @returns The esri geometry type.
     */
    mageTypeToEsriType(mageGeometryType: string): string {
        let esriGeometryType = ''

        switch (mageGeometryType) {
            case 'Point':
                esriGeometryType = 'esriGeometryPoint'
                break;
            case 'LineString':
                esriGeometryType = 'esriGeometryPolyline'
                break;
            case 'Polygon':
                esriGeometryType = 'esriGeometryPolygon'
                break;
            default:
                break;
        }

        return esriGeometryType;
    }

    /**
     * Determine the observation Esri geometry type.
     * @param observation The observation.
     * @returns The Esri geometry type.
     */
    private esriGeometryType(observation: ObservationAttrs): string {

        let esriGeometryType = ''

        if (observation.geometry != null) {
            esriGeometryType = this.mageTypeToEsriType(observation.geometry.type);
        }

        return esriGeometryType
    }

    /**
     * Converts and adds observation values to ArcObject attributes.
     * @param observation The observation to convert.
     * @param transform The Event transform.
     * @param user The MAGE user.
     * @param arcObject The converted ArcObject.
     */
    private observationToAttributes(observation: ObservationAttrs, transform: EventTransform, user: User | null, arcObject: ArcObject) {
        let observationIdValue = observation.id;
        if (this._config.observationIdField == this._config.eventIdField) {
            observationIdValue += this._config.idSeperator + observation.eventId
        } else {
            this.addAttribute(this._config.eventIdField, observation.eventId, arcObject)
        }
        this.addAttribute(this._config.observationIdField, observationIdValue, arcObject)
        const mageEvent = transform.mageEvent
        if (mageEvent != null) {
            this.addAttribute(this._config.eventNameField, mageEvent.name, arcObject)
        }
        if (observation.userId != null) {
            this.addAttribute(this._config.userIdField, observation.userId, arcObject)
        }
        if (user != null) {
            this.addAttribute(this._config.usernameField, user.username, arcObject)
            this.addAttribute(this._config.userDisplayNameField, user.displayName, arcObject)
        }
        if (observation.deviceId != null) {
            this.addAttribute(this._config.deviceIdField, observation.deviceId, arcObject)
        }
        this.addAttribute(this._config.createdAtField, observation.createdAt, arcObject)
        this.addAttribute(this._config.lastModifiedField, observation.lastModified, arcObject)
    }

    /**
     * Converts an observation geometry to an ArcGeometry.
     * @param geometry The observation geometry to convert.
     * @returns The converted ArcGeometry.
     */
    private geometryToArcGeometry(geometry: Geometry): ArcGeometry {

        var arcGeometry = {} as ArcGeometry

        switch (geometry.type) {
            case 'Point':
                arcGeometry = this.pointToArcPoint(geometry as Point)
                break;
            case 'LineString':
                arcGeometry = this.lineStringToArcPolyline(geometry as LineString)
                break;
            case 'Polygon':
                arcGeometry = this.polygonToArcPolygon(geometry as Polygon)
                break;
            default:
                break;
        }

        arcGeometry.spatialReference = { wkid: 4326 }

        return arcGeometry
    }

    /**
     * Converts an observation Point to an ArcPoint.
     * @param point The observation Point to convert.
     * @returns The converted ArcPoint.
     */
    private pointToArcPoint(point: Point): ArcPoint {
        const arcPoint = {} as ArcPoint
        arcPoint.x = point.coordinates[0]
        arcPoint.y = point.coordinates[1]
        return arcPoint
    }

    /**
     * Converts an observation LineString to an ArcPolyline.
     * @param lineString The observation LineString to convert.
     * @returns The converted ArcPolyline.
     */
    private lineStringToArcPolyline(lineString: LineString): ArcPolyline {
        const arcPolyline = {} as ArcPolyline
        arcPolyline.paths = [lineString.coordinates]
        return arcPolyline
    }

    /**
     * Converts an observation Polygon to an ArcPolygon.
     * @param polygon The observation Polygon to convert.
     * @returns The converted ArcPolygon.
     */
    private polygonToArcPolygon(polygon: Polygon): ArcPolygon {
        const arcPolygon = {} as ArcPolygon
        arcPolygon.rings = polygon.coordinates
        return arcPolygon
    }

    /**
     * Converts and adds observation properties to ArcObject attributes.
     * @param properties The observation properties to convert.
     * @param transform The Event transform.
     * @param arcObject The converted ArcObject.
     * @return form ids map
     */
    private propertiesToAttributes(properties: { [name: string]: any }, transform: EventTransform, arcObject: ArcObject): { [name: string]: number } {
        let formIds: { [name: string]: number } = {}
        for (const property in properties) {
            const value = properties[property]
            if (property == 'forms') {
                formIds = this.formsToAttributes(value, transform, arcObject)
            } else {
                this.addAttribute(property, value, arcObject)
            }
        }
        return formIds
    }

    /**
     * Converts and adds observation property forms data to ArcObject attributes.
     * @param forms The observation property forms to convert.
     * @param transform The Event transform.
     * @param arcObject The converted ArcObject.
     * @return form ids map
     */
    private formsToAttributes(forms: [{ [name: string]: any }], transform: EventTransform, arcObject: ArcObject): { [name: string]: number } {

        const formIds: { [id: string]: number } = {}
        const formIdCount: { [id: number]: number } = {}

        const mageEvent = transform.mageEvent

        for (let i = 0; i < forms.length; i++) {
            const form = forms[i]
            const formId = form['formId']
            const id = form['id']
            let fields = null
            let formCount = 1
            if (formId != null && id != null) {
                formIds[id] = formId
                let count = formIdCount[formId]
                if (count == null) {
                    count = 0
                }
                formCount = count + 1
                formIdCount[formId] = formCount
                fields = transform.get(formId)
            }
            for (const formProperty in form) {
                let value = form[formProperty]
                if (value != null) {
                    if (mageEvent != null && formId != null) {
                        const field = mageEvent.formFieldFor(formProperty, formId)
                        if (field != null && field.type !== FormFieldType.Attachment) {
                            let title = field.title
                            if (fields != undefined) {
                                const fieldTitle = fields.get(title)
                                if (fieldTitle != undefined) {
                                    title = fieldTitle
                                }
                            }
                            title = this.appendCount(title, formCount)
                            if (field.type == FormFieldType.Geometry) {
                                value = this.geometryToArcGeometry(value)
                            }
                            this.addAttribute(title, value, arcObject)
                        }
                    } else {
                        const title = this.appendCount(formProperty, formCount)
                        this.addAttribute(title, value, arcObject)
                    }
                }
            }
        }

        return formIds
    }

    /**
     * Add an ArcObject attribute.
     * @param key The attribute key.
     * @param value The attribute value.
     * @param arcObject The converted ArcObject.
     */
    private addAttribute(key: string, value: any, arcObject: ArcObject) {
        if (value != null) {
            if (arcObject.attributes == null) {
                arcObject.attributes = {}
            }
            key = this.replaceSpaces(key)
            if (Object.prototype.toString.call(value) === '[object Date]') {
                value = new Date(value).getTime()
            }
            arcObject.attributes[key] = value
        }
    }

    /**
     * Transform observation attachments.
     * @param attachments The observation attachments.
     * @param formIds Form ids map.
     * @param transform The Event transform.
     * @return  The converted ArcAttachments.
     */
    private attachments(attachments: readonly Attachment[], formIds: { [name: string]: number }, transform: EventTransform): ArcAttachment[] {

        const arcAttachments: ArcAttachment[] = []

        const mageEvent = transform.mageEvent

        for (const attachment of attachments) {

            if (attachment.contentLocator != null) {

                let fieldName = attachment.fieldName
                if (mageEvent != null) {
                    const formId = formIds[attachment.observationFormId]
                    if (formId != null) {
                        const field = mageEvent.formFieldFor(fieldName, formId)
                        if (field != null) {
                            fieldName = field.title
                        }
                    }
                }

                const arcAttachment = {} as ArcAttachment
                arcAttachment.field = this.replaceSpaces(fieldName)
                if (attachment.lastModified != null) {
                    arcAttachment.lastModified = new Date(attachment.lastModified).getTime()
                }
                if (attachment.size != null) {
                    arcAttachment.size = attachment.size
                }
                if (attachment.name != null) {
                    const extensionIndex = attachment.name.lastIndexOf('.')
                    if (extensionIndex != -1) {
                        arcAttachment.name = attachment.name.substring(0, extensionIndex)
                    } else {
                        arcAttachment.name = attachment.name
                    }
                } else {
                    arcAttachment.name = attachment.id
                }
                arcAttachment.contentLocator = attachment.contentLocator

                arcAttachments.push(arcAttachment)
            }
        }

        return arcAttachments
    }

    /**
     * Replace spaces in the name with underscores.
     * @param name The name.
     * @return name with replaced spaces.
     */
    private replaceSpaces(name: string): string {
        return name.replace(/ /g, '_')
    }

    /**
     * Append a count to a name for additional duplicate field names.
     * @param name The name.
     * @param count The count.
     * @return name with count.
     */
    private appendCount(name: string, count: number): string {
        let value = name
        if (count > 1) {
            value += '_' + count
        }
        return value
    }

}