import { ObservationAttrs } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'
import { MageEvent } from '@ngageoint/mage.service/lib/entities/events/entities.events'
import { User } from '@ngageoint/mage.service/lib/entities/users/entities.users'
import { FormFieldType } from '@ngageoint/mage.service/lib/entities/events/entities.events.forms'
import { Geometry, Point, LineString, Polygon } from 'geojson'
import { ArcGeometry, ArcObject, ArcPoint, ArcPolyline, ArcPolygon } from './ArcObject'

/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
export class ObservationsTransformer {

    /**
     * Used to log to the console.
     */
    _console: Console

    /**
     * Constructor.
     * @param console Used to log to the console.
     */
    constructor(console: Console) {
        this._console = console
    }

    /**
     * Converts the specified observation into an ArcObject that can be sent to an arcgis server.
     * @param observation The observation to convert.
     * @param mageEvent The MAGE event.
     * @param user The MAGE user.
     * @returns The ArcObject of the observation.
     */
    transform(observation: ObservationAttrs, mageEvent: MageEvent | null, user: User | null): ArcObject {
        const arcObject = {} as ArcObject

        this.observationToAttributes(observation, mageEvent, user, arcObject)

        if (observation.geometry != null) {
            this.geometryToArcGeometry(observation.geometry, observation.id, arcObject)
        }

        if (observation.properties != null) {
            this.propertiesToAttributes(observation.properties, mageEvent, arcObject)
        }

        // TODO DELETE THE FOLLOWING LINE (Temporary observation id as description value override)
        this.addAttribute('description', observation.id, arcObject)

        return arcObject
    }

    /**
     * Converts and adds observation values to ArcObject attributes.
     * @param observation The observation to convert.
     * @param mageEvent The MAGE event.
     * @param user The MAGE user.
     * @param arcObject The converted ArcObject.
     */
    private observationToAttributes(observation: ObservationAttrs, mageEvent: MageEvent | null, user: User | null, arcObject: ArcObject) {
        this.addAttribute('id', observation.id, arcObject)
        this.addAttribute('eventId', observation.eventId, arcObject)
        if (mageEvent != null) {
            this.addAttribute('eventName', mageEvent.name, arcObject)
        }
        if (observation.userId != null) {
            this.addAttribute('userId', observation.userId, arcObject)
        }
        if (user != null) {
            this.addAttribute('username', user.username, arcObject)
            this.addAttribute('userDisplayName', user.displayName, arcObject)
        }
        if (observation.deviceId != null) {
            this.addAttribute('deviceId', observation.deviceId, arcObject)
        }
        this.addAttribute('createdAt', observation.createdAt, arcObject)
        this.addAttribute('lastModified', observation.lastModified, arcObject)
    }

    /**
     * Converts and sets an observation geometry to an ArcObject geometry.
     * @param geometry The observation geometry to convert.
     * @param observationId The observation id.
     * @param arcObject The converted ArcObject.
     */
    private geometryToArcGeometry(geometry: Geometry, observationId: string, arcObject: ArcObject) {

        var arcGeometry = {} as ArcGeometry

        switch (geometry.type) {
            case 'Point':
                arcGeometry = this.pointToArcPoint(geometry as Point, observationId)
                break;
            case 'LineString':
                arcGeometry = this.lineStringToArcPolyline(geometry as LineString, observationId)
                break;
            case 'Polygon':
                arcGeometry = this.polygonToArcPolygon(geometry as Polygon, observationId)
                break;
            default:
                break;
        }

        arcGeometry.spatialReference = { wkid: 4326 }
        arcObject.geometry = arcGeometry

    }

    /**
     * Converts an observation Point to an ArcPoint.
     * @param point The observation Point to convert.
     * @param observationId The observation id.
     * @returns The converted ArcPoint.
     */
    private pointToArcPoint(point: Point, observationId: string): ArcPoint {
        this._console.info('ArcGIS new point at ' + point.coordinates + ' with id ' + observationId)
        const arcPoint = {} as ArcPoint
        arcPoint.x = point.coordinates[0]
        arcPoint.y = point.coordinates[1]
        return arcPoint
    }

    /**
     * Converts an observation LineString to an ArcPolyline.
     * @param lineString The observation LineString to convert.
     * @param observationId The observation id.
     * @returns The converted ArcPolyline.
     */
    private lineStringToArcPolyline(lineString: LineString, observationId: string): ArcPolyline {
        this._console.info('ArcGIS new linestring at ' + lineString.coordinates + ' with id ' + observationId)
        const arcPolyline = {} as ArcPolyline
        arcPolyline.paths = [lineString.coordinates]
        return arcPolyline
    }

    /**
     * Converts an observation Polygon to an ArcPolygon.
     * @param polygon The observation Polygon to convert.
     * @param observationId The observation id.
     * @returns The converted ArcPolygon.
     */
    private polygonToArcPolygon(polygon: Polygon, observationId: string): ArcPolygon {
        this._console.info('ArcGIS new polygon at ' + polygon.coordinates + ' with id ' + observationId)
        const arcPolygon = {} as ArcPolygon
        arcPolygon.rings = polygon.coordinates
        return arcPolygon
    }

    /**
     * Converts and adds observation properties to ArcObject attributes.
     * @param properties The observation properties to convert.
     * @param mageEvent The MAGE event.
     * @param arcObject The converted ArcObject.
     */
    private propertiesToAttributes(properties: { [name: string]: any }, mageEvent: MageEvent | null, arcObject: ArcObject) {
        for (const property in properties) {
            const value = properties[property]
            if (property == 'forms') {
                this.formsToAttributes(value, mageEvent, arcObject)
            } else {
                this.addAttribute(property, value, arcObject)
            }
        }
    }

    /**
     * Converts and adds observation property forms data to ArcObject attributes.
     * @param forms The observation property forms to convert.
     * @param mageEvent The MAGE event.
     * @param arcObject The converted ArcObject.
     */
     private formsToAttributes(forms: [{ [name: string]: any }], mageEvent: MageEvent | null, arcObject: ArcObject) {
        
        for (let i = 0; i < forms.length; i++) {
            const form = forms[i]
            const formId = form['formId']
            for (const formProperty in form) {
                const value = form[formProperty]
                if (value != null) {
                    if (mageEvent != null && formId != null) {
                        const field = mageEvent.formFieldFor(formProperty, formId)
                        if (field != null && field.type !== FormFieldType.Attachment) {
                            this.addAttribute(field.title, value, arcObject)
                        }
                    } else {
                        this.addAttribute(formProperty, value, arcObject)
                    }
                }
            }
        }

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
            if (Object.prototype.toString.call(value) === '[object Date]') {
                value = new Date(value).getTime()
            }
            arcObject.attributes[key] = value
        }
    }

}