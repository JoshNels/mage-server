import { ObservationAttrs } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'
import { MageEvent } from "@ngageoint/mage.service/lib/entities/events/entities.events"
import { FormFieldType } from '@ngageoint/mage.service/lib/entities/events/entities.events.forms'
import { Point } from 'geojson'
import { ArcObject } from './ArcObject'

/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
export class ObservationsTransformer {

    /**
     * Used to log to the console.
     */
    _console: Console;

    /**
     * Constructor.
     * @param console Used to log to the console.
     */
    constructor(console: Console) {
        this._console = console;
    }

    /**
     * Converts the specified observations into a json string that can be sent to an arcgis server.
     * @param observations The observations to convert.
     * @param mageEvent The MAGE event.
     * @returns The json string of the observations.
     */
    transform(observations: ObservationAttrs[], mageEvent: MageEvent | null): ArcObject[] {

        const arcObjects: ArcObject[] = [];

        for (let i = 0; i < observations.length; i++) {
            const arcObject = this.observationToArcGIS(observations[i], mageEvent);
            arcObjects.push(arcObject);
        }

        return arcObjects;
    }

    /**
     * Converts an observation to an ArcObject.
     * @param observation The observation to convert.
     * @param mageEvent The MAGE event.
     * @returns The converted ArcObject.
     */
    private observationToArcGIS(observation: ObservationAttrs, mageEvent: MageEvent | null): ArcObject {
        const arcObject: ArcObject = {} as ArcObject

        arcObject.geometry = { x: 0, y: 0, spatialReference: { wkid: 4326 } }
        if (observation.geometry.type == 'Point') { // TODO: LineString & Polygon
            const pointgeom = observation.geometry as Point
            this._console.info('ArcGIS new point at ' + pointgeom.coordinates + ' with id ' + observation.id)
            arcObject.geometry.x = pointgeom.coordinates[0]
            arcObject.geometry.y = pointgeom.coordinates[1]
        }

        if (observation.properties != null) {
            const properties: { [name: string]: any } = observation.properties
            for (const property in properties) {
                const value = properties[property]
                if (property == 'forms') {
                    this.formsToArcGIS(value, mageEvent, arcObject);
                } else {
                    this.addAttribute(property, value, arcObject)
                }
            }
        }

        return arcObject
    }

    /**
     * Converts observation forms data to an ArcObject.
     * @param forms The observation forms to convert.
     * @param mageEvent The MAGE event.
     * @param arcObject The converted ArcObject.
     */
     private formsToArcGIS(forms: [{ [name: string]: any }], mageEvent: MageEvent | null, arcObject: ArcObject) {
        
        for (let i = 0; i < forms.length; i++) {
            const form = forms[i]
            const formId = form['formId']
            for (const formProperty in form) {
                const value = form[formProperty]
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

    /**
     * Add an ArcObject attribute.
     * @param key The attribute key.
     * @param value The attribute value.
     * @param arcObject The converted ArcObject.
     */
    private addAttribute(key: string, value: any, arcObject: ArcObject) {
        if (arcObject.attributes == null) {
            arcObject.attributes = {}
        }
        if (value != null) {
            if (Object.prototype.toString.call(value) === '[object Date]') {
                value = new Date(value).getTime()
            }
        }
        arcObject.attributes[key] = value
    }

}