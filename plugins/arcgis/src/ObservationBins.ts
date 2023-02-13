import { ArcObject } from "./ArcObject";

/**
 * Contains the arc objects that either need to be added or updated to the arc server.
 */
export class ObservationBins {

    /**
     * The arc objects to add to the server.
     */
    adds: ArcObject[];

    /**
     * The arc objects to update on the server.
     */
    updates: ArcObject[];

    /**
     * Constructor.
     */
    constructor() {
        this.adds = [];
        this.updates = [];
    }
}