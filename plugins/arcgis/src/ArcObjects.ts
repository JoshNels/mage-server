import { ArcObject } from './ArcObject'
import { ArcObservation } from './ArcObservation'

/**
 * Contains both the features to send to arc and their attachments.
 */
export class ArcObjects {

    /**
     * The features to send to the arc server.
     */
    objects: ArcObject[]

    /**
     * The attachments to send to the arc server.
     */
    observations: ArcObservation[]

    /**
     * Indicates if these arc objects have been created from observations in the database and this
     * is the server's first run at it.  If its the servers first run we will need to ensure
     * the arc feature layers are all up to date.
     */
    firstRun: boolean;

    /**
     * Constructor.
     */
    constructor() {
        this.objects = []
        this.observations = []
        this.firstRun = false;
    }

    /**
     * Add an observation.
     * @param observation The observation to add.
     */
    add(observation: ArcObservation) {
        this.observations.push(observation)
        this.objects.push(observation.object)
    }

    /**
     * Count of observations.
     * @return observation count.
     */
    count(): number {
        return this.objects.length
    }

    /**
     * Is observations empty.
     * @return true if empty.
     */
    isEmpty(): boolean {
        return this.count() == 0
    }

    /**
     * Clear the observations.
     */
    clear() {
        this.objects = []
        this.observations = []
    }

}