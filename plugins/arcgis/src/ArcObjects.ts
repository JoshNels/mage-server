import { ArcObject } from './ArcObject'
import { ArcObservation } from './ArcObservation'

/**
 * Contains both the features to send to arc and their attachments.
 */
export class ArcObjects {

    /**
     * The features to send to the arc server.
     */
    objects: ArcObject[];

    /**
     * The attachments to send to the arc server.
     */
    observations: ArcObservation[];

    /**
     * Constructor.
     */
    constructor() {
        this.objects = [];
        this.observations = [];
    }
}