import { ArcObjects } from "./ArcObjects";
import { ArcObservation } from "./ArcObservation";
import { FeatureQuerier } from "./FeatureQuerier";
import { ObservationBins } from "./ObservationBins";

/**
 * Sorts the observations into a group of new ones and a group of updated ones.
 */
export class ObservationBinner {

    /**
     * The number of existence queries we are still waiting for.
     */
    private _existenceQueryCount: number;

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
        this._existenceQueryCount = 0;
    }

    /**
     * Indicates if this binner has pending updates still waiting to be processed.
     * @returns True if it is still waiting for updates to be processed, false otherwise.
     */
    hasPendingUpdates(): boolean {
        return this._existenceQueryCount > 0;
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
        this._existenceQueryCount++;
        this._featureQuerier.queryObject(arcObservation.id, (result) => {
            this._existenceQueryCount--;
            if (result.features != null && result.features.length > 0) {

                const objectIdField = result.objectIdFieldName
                const arcAttributes = result.features[0].attributes

                const updateAttributes = arcObservation.object.attributes

                updateAttributes[objectIdField] = arcAttributes[objectIdField]

                // Determine if any attribute values should be deleted
                const lowerCaseUpdateAttributes = Object.fromEntries(
                    Object.entries(updateAttributes).map(([k, v]) => [k.toLowerCase(), v])
                )
                for (const arcAttribute of Object.keys(arcAttributes)) {
                    if (lowerCaseUpdateAttributes[arcAttribute.toLowerCase()] == null) {
                        updateAttributes[arcAttribute] = null
                    }
                }

                this._pendingNewAndUpdates.updates.add(arcObservation)
            } else {
                this._pendingNewAndUpdates.adds.add(arcObservation);
            }
        });
    }
}