import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { ArcObject } from "./ArcObject";
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
     * @param config The plugins configuration.
     * @param console Used to log to the console.
     */
    constructor(config: ArcGISPluginConfig, console: Console) {
        this._httpClient = new HttpClient(console);
        this._url = config.featureLayers[0] + '/query?returnsIdsOnly=true&f=json&where=description=\'';
        this._pendingNewAndUpdates = new ObservationBins;
        this._console = console;
    }

    /**
     * Gets any pending updates or adds that still need to occur.
     * @returns The updates or adds that still need to occur.
     */
    pendingUpdates(): ObservationBins {
        const newAndUpdates = new ObservationBins();
        newAndUpdates.adds = this._pendingNewAndUpdates.adds;
        newAndUpdates.updates = this._pendingNewAndUpdates.updates;
        this._pendingNewAndUpdates.updates.objects = [];
        this._pendingNewAndUpdates.updates.observations = [];
        this._pendingNewAndUpdates.adds.objects = [];
        this._pendingNewAndUpdates.adds.observations = [];

        return newAndUpdates;
    }

    /**
     * Sorts the observations into new observations or update observations.
     * @param observations The observations to sort out.
     * @returns The sorted out observations.
     */
    sortEmOut(observations: ArcObjects): ObservationBins {
        const bins = new ObservationBins();

        for (let i = 0; i < observations.objects.length; i++) {
            const arcObject = observations.objects[i];
            const arcObservation = observations.observations[i]
            if (arcObject.attributes['lastModified'] != arcObject.attributes['createdAt']) {
                bins.updates.objects.push(arcObject);
                bins.updates.observations.push(arcObservation);
            } else {
                bins.adds.objects.push(arcObject);
                bins.adds.observations.push(arcObservation);
            }
        }

        for (let i = 0; i < bins.updates.objects.length; i++) {
            this.checkForExistence(bins.updates.objects[i], bins.updates.observations[i]);
        }
        bins.updates = this._pendingNewAndUpdates.updates;

        return bins;
    }

    /**
     * Checks to see if the observation truly does exist on the server.
     * @param observation The observation to check.
     * @returns True if it exists, false if it does not.
     */
    checkForExistence(arcObject: ArcObject, arcObservation: ArcObservation) {
        const queryUrl = this._url + arcObject.attributes['description'] + '\'';
        this._httpClient.sendGetHandleResponse(queryUrl, (chunk) => {
            this._console.info('ArcGIS response for ' + queryUrl + ' ' + chunk);
            const result = JSON.parse(chunk) as QueryResults;
            if (result.objectIds !== undefined && result.objectIds.length > 0) {
                this._pendingNewAndUpdates.updates.objects.push(arcObject);
                this._pendingNewAndUpdates.updates.observations.push(arcObservation);
            } else {
                this._pendingNewAndUpdates.adds.objects.push(arcObject);
                this._pendingNewAndUpdates.adds.observations.push(arcObservation);
            }
        });
    }
}