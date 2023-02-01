import { ObservationAttrs } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'
import { Point } from 'geojson'

// Define the structure of the converted arc objects.
interface ArcObject {
    x: number;
    y: number;
    z: number;
    spatialReference: {
        wkid: number;
    };
}

/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
export class ObservationsTransformer {

    /**
     * Converts the specified observations into a json string that can be sent to an arcgis server.
     * @param observations The observations to convert.
     * @returns The json string of the observations.
     */
    transform(observations: ObservationAttrs[]) : string {
        let jsonObservations = '';

        let arcObjects : ArcObject[] = [];

        for(let i = 0; i < observations.length; i++) {
            const arcObject = this.geojsonToArcGIS(observations[i]);
            arcObjects.push(arcObject);
        }

        jsonObservations = JSON.stringify(arcObjects);
        
        return jsonObservations;
    }

    /**
     * Converts an observation to an ArcObject.
     * @param observation The observation to convert.
     * @returns The converted ArcObject.
     */
    private geojsonToArcGIS(observation: ObservationAttrs) : ArcObject {
        let arcObject = {x: 0, y: 0, z: 0, spatialReference: {wkid: 4326 }};
        if(observation.geometry.type == 'Point') {
            const pointgeom = observation.geometry as Point;
            arcObject.x = pointgeom.coordinates[0];
            arcObject.y = pointgeom.coordinates[1];
            if(pointgeom.coordinates.length >3) {
                arcObject.z = pointgeom.coordinates[2];
            }
        }
        return arcObject;
    }
}