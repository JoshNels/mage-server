import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { ArcObjects } from "./ArcObjects";
import { ArcObservation } from "./ArcObservation";
import { FeatureQuerier } from "./FeatureQuerier";
import { HttpClient } from "./HttpClient";
import { ObservationBins } from "./ObservationBins";
import { QueryObjectIdResults } from "./QueryObjectIdResults";

/**
 * Sorts the observations into a group of new ones and a group of updated ones.
 */
export class ObservationBinner {

    /**
     * The query url to find out if an observations exists on the server.
     */
    private _featureQuerier: FeatureQuerier;

    /**
     * Contains the results from checking if an observation exists on the server.
     */
    private _pendingNewAndUpdates: ObservationBins;

    /**
     * Constructor.
     * @param featureQuerier Used to query for observation on the arc feature layer.
     * @param obsFieldId The field that stores the observation id.
     * @param console Used to log to the console.
     */
    constructor(featureQuerier: FeatureQuerier) {
        this._featureQuerier = featureQuerier;
        this._pendingNewAndUpdates = new ObservationBins;
    }

    /**
     * Gets any pending updates or adds that still need to occur.
     * @returns The updates or adds that still need to occur.
     */
    pendingUpdates(): ObservationBins {
        const newAndUpdates = new ObservationBins();
        for (let i = 0; i < this._pendingNewAndUpdates.adds.count(); i++) {
            newAndUpdates.adds.add(this._pendingNewAndUpdates.adds.observations[i]);
        }
        for (let i = 0; i < this._pendingNewAndUpdates.updates.count(); i++) {
            newAndUpdates.updates.add(this._pendingNewAndUpdates.updates.observations[i]);
        }
        this._pendingNewAndUpdates.clear();

        return newAndUpdates;
    }

    /**
     * Sorts the observations into new observations or update observations.
     * @param observations The observations to sort out.
     * @returns The sorted out observations.
     */
    sortEmOut(observations: ArcObjects): ObservationBins {
        const bins = new ObservationBins();

        for (const arcObservation of observations.observations) {
            const arcObject = arcObservation.object
            if (observations.firstRun
                || arcObservation.lastModified != arcObservation.createdAt
                || arcObject.attributes.last_modified != arcObject.attributes.created_at) {
                bins.updates.add(arcObservation);
            } else {
                bins.adds.add(arcObservation);
            }
        }

        for (const arcObservation of bins.updates.observations) {
            this.checkForExistence(arcObservation);
        }
        bins.updates = this._pendingNewAndUpdates.updates;

        return bins;
    }

    /**
     * Checks to see if the observation truly does exist on the server.
     * @param arcObservation The observation to check.
     * @returns True if it exists, false if it does not.
     */
    checkForExistence(arcObservation: ArcObservation) {
        this._featureQuerier.queryObjectId(arcObservation.id, (result) => {
            if (result.objectIds !== undefined && result.objectIds != null && result.objectIds.length > 0) {
                arcObservation.object.attributes['OBJECTID'] = result.objectIds[0];
                this._pendingNewAndUpdates.updates.add(arcObservation);
            } else {
                this._pendingNewAndUpdates.adds.add(arcObservation);
            }
        });
    }
}