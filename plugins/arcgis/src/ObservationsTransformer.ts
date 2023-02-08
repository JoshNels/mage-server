import { ObservationAttrs } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'
import { Point } from 'geojson'

// Define the structure of the converted arc objects.
export interface ArcObject {
    geometry: {
        x: number;
        y: number;
        spatialReference: {
            wkid: number;
        }
    };
}

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
     * @returns The json string of the observations.
     */
    transform(observations: ObservationAttrs[]): ArcObject[] {
        let jsonObservations = '';

        let arcObjects: ArcObject[] = [];

        for (let i = 0; i < observations.length; i++) {
            const arcObject = this.geojsonToArcGIS(observations[i]);
            arcObjects.push(arcObject);
        }

        return arcObjects;
    }

    /**
     * Converts an observation to an ArcObject.
     * @param observation The observation to convert.
     * @returns The converted ArcObject.
     */
    private geojsonToArcGIS(observation: ObservationAttrs): ArcObject {
        let arcObject = { geometry: { x: 0, y: 0, spatialReference: { wkid: 4326 } } };
        if (observation.geometry.type == 'Point') {
            const pointgeom = observation.geometry as Point;
            this._console.info('ArcGIS new point at ' + pointgeom.coordinates + ' with id ' + observation.id);
            arcObject.geometry.x = pointgeom.coordinates[0];
            arcObject.geometry.y = pointgeom.coordinates[1];

        }
        return arcObject;
    }
}