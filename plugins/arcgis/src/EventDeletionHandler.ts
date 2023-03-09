import { MageEventAttrs } from "@ngageoint/mage.service/lib/entities/events/entities.events";
import { FeatureLayerProcessor } from "./FeatureLayerProcessor";
import { QueryObjectResult } from "./QueryObjectResult";
import { ArcGISPluginConfig } from "./ArcGISPluginConfig";

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
     * Contains the name of the id field.
     */
    private _config: ArcGISPluginConfig;

    /**
     * Constructor.
     * @param console Used to log messages.
     * @param config The plugin configuration.
     */
    constructor(console: Console, config: ArcGISPluginConfig) {
        this._currentEventIds = new Map<number, string>();
        this._console = console;
        this._config = config;
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

            for (const layerProcesor of layerProcessors) {
                layerProcesor.featureQuerier.queryAllObservations((result) => { this.figureOutAllEventsOnArc(layerProcesor, result); });
            }
        } else {
            this._console.log('Checking for event deletions the previous known events are:');
            let deletedEvents = new Map<number, string>();
            this._currentEventIds.forEach((eventName: string, eventId: number) => {
                this._console.log(eventName + ' with id ' + eventId);
                deletedEvents.set(eventId, eventName);
            });

            this._console.log('Active events are:')
            for (const activeEvent of activeEvents) {
                this._console.log(activeEvent.name + ' with id ' + activeEvent.id);
                deletedEvents.delete(activeEvent.id);
            }

            deletedEvents.forEach((eventName: string, eventId: number) => {
                this._console.log('Event named ' + eventName + ' was deleted removing observations from arc layers');
                for (const layerProcessor of layerProcessors) {
                    layerProcessor.sender.sendDeleteEvent(eventId);
                }
                this._currentEventIds.delete(eventId);
            });

            for (const activeEvent of activeEvents) {
                this._currentEventIds.set(activeEvent.id, activeEvent.name);
            }
        }
    }

    /**
     * Called when the query is finished.  It goes through the results and gathers all even Ids currently stored
     * in the arc layer.  It then will remove any events from the arc layer that do not exist.
     * @param layerUrl The url to the layer.
     * @param result The returned results.
     */
    figureOutAllEventsOnArc(layerProcesor: FeatureLayerProcessor, result: QueryObjectResult) {
        this._console.log('ArcGIS investigating all events for feature layer ' + layerProcesor.layerInfo.url);
        let arcEventIds = new Set<number>();
        for (const feature of result.features) {
            if (this._config.eventIdField == null || this._config.observationIdField == this._config.eventIdField) {
                const obsAndEventId = feature.attributes[this._config.observationIdField] as string;
                const splitIds = obsAndEventId.split(this._config.idSeperator);
                arcEventIds.add(parseInt(splitIds[1]));
            } else {
                arcEventIds.add(feature.attributes[this._config.eventIdField]);
            }
        }

        this._currentEventIds.forEach((eventName: string, eventId: number) => {
            arcEventIds.delete(eventId);
        });

        for (const arcEventId of arcEventIds) {
            layerProcesor.sender.sendDeleteEvent(arcEventId);
        }
    }
}