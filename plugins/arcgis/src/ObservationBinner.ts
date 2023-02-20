import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { ArcObjects } from "./ArcObjects";
import { ArcObservation } from "./ArcObservation";
import { HttpClient } from "./HttpClient";
import { ObservationBins } from "./ObservationBins";
import { QueryResults } from "./QueryResults";

/**
 * Sorts the observations into a group of new ones and a group of updated ones.
 */
export class ObservationBinner {

    /**
     * Used to query the arc server to figure out if an observation exists.
     */
    _httpClient: HttpClient;

    /**
     * The query url to find out if an observations exists on the server.
     */
    _url: string;

    /**
     * Contains the results from checking if an observation exists on the server.
     */
    _pendingNewAndUpdates: ObservationBins;

    /**
     * Used to log to console.
     */
    _console: Console;

    /**
     * Constructor.
     * @param url The url to the feature layer.
     * @param obsFieldId The field that stores the observation id.
     * @param console Used to log to the console.
     */
    constructor(url: string, obsFieldId: string, console: Console) {
        this._httpClient = new HttpClient(console);
        this._url = url + '/query?returnIdsOnly=true&f=json&where=' + obsFieldId + '=\'';
        this._pendingNewAndUpdates = new ObservationBins;
        this._console = console;
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
            if (arcObservation.lastModified != arcObservation.createdAt) {
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
        const queryUrl = this._url + arcObservation.id + '\'';
        this._httpClient.sendGetHandleResponse(queryUrl, (chunk) => {
            this._console.info('ArcGIS response for ' + queryUrl + ' ' + chunk);
            const result = JSON.parse(chunk) as QueryResults;
            if (result.objectIds !== undefined && result.objectIds != null && result.objectIds.length > 0) {
                arcObservation.object.attributes['OBJECTID'] = result.objectIds[0];
                this._pendingNewAndUpdates.updates.add(arcObservation);
            } else {
                this._pendingNewAndUpdates.adds.add(arcObservation);
            }
        });
    }
}