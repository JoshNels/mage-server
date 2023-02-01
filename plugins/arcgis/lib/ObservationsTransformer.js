"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationsTransformer = void 0;
/**
 * Class that transforms observations into a json string that can then be sent to an arcgis server.
 */
class ObservationsTransformer {
    /**
     * Converts the specified observations into a json string that can be sent to an arcgis server.
     * @param observations The observations to convert.
     * @returns The json string of the observations.
     */
    transform(observations) {
        let jsonObservations = '';
        let arcObjects = [];
        for (let i = 0; i < observations.length; i++) {
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
    geojsonToArcGIS(observation) {
        let arcObject = { x: 0, y: 0, z: 0, spatialReference: { wkid: 4326 } };
        if (observation.geometry.type == 'Point') {
            const pointgeom = observation.geometry;
            arcObject.x = pointgeom.coordinates[0];
            arcObject.y = pointgeom.coordinates[1];
            if (pointgeom.coordinates.length > 3) {
                arcObject.z = pointgeom.coordinates[2];
            }
        }
        return arcObject;
    }
}
exports.ObservationsTransformer = ObservationsTransformer;
//# sourceMappingURL=ObservationsTransformer.js.map