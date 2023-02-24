import { MageEventAttrs } from "@ngageoint/mage.service/lib/entities/events/entities.events";
import { ObservationAttrs } from "@ngageoint/mage.service/lib/entities/observations/entities.observations";
import { ArcObjects } from "./ArcObjects";
import { FeatureLayerProcessor } from "./FeatureLayerProcessor";

/**
 * Class that handles deleting observations from an arc server for any deleted events.
 */
export class EventDeletionHandler {

    /**
     * The current set of event ids.
     */
    private _currentEventIds: Map<number, string>;

    /**
     * Used to log messages.
     */
    private _console: Console;

    /**
     * Constructor.
     * @param console Used to log messages.
     */
    constructor(console: Console) {
        this._currentEventIds = new Map<number, string>();
        this._console = console;
    }

    /**
     * 
     * @param activeEvents The current set of active events.
     * @param layerProcessors The different layer processors currently syncing arc layers with mage data.
     * @param firstRun True if this is the first run at startup.
     */
    checkForEventDeletion(activeEvents: MageEventAttrs[], layerProcessors: FeatureLayerProcessor[], firstRun: boolean) {
        if (firstRun) {
            for (const activeEvent of activeEvents) {
                this._currentEventIds.set(activeEvent.id, activeEvent.name);
            }
        } else {
            let deletedEvents = new Map<number, string>();
            this._currentEventIds.forEach((eventName: string, eventId: number) => {
                deletedEvents.set(eventId, eventName);
            });

            for (const activeEvent of activeEvents) {
                deletedEvents.delete(activeEvent.id);
            }

            deletedEvents.forEach((eventName: string, eventId: number) =>  {
                this._console.log('Event named ' + eventName + ' was deleted removing observations from arc layers');
                for (const layerProcessor of layerProcessors) {
                    layerProcessor.sender.sendDeleteEvent(eventId);
                }
                this._currentEventIds.delete(eventId);
            });
        }
    }
}