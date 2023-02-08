import { PagingParameters } from "@ngageoint/mage.service/lib/entities/entities.global";
import { MageEventRepository } from "@ngageoint/mage.service/lib/entities/events/entities.events";
import { EventScopedObservationRepository, ObservationRepositoryForEvent } from "@ngageoint/mage.service/lib/entities/observations/entities.observations";
import { ArcGISPluginConfig } from "./ArcGISPluginConfig";
import { Point } from 'geojson'
import { ObservationsTransformer } from './ObservationsTransformer'
import { ObservationsSender } from "./ObservationsSender";

/**
 * Class that wakes up at a certain configured interval and processes any new observations that can be
 * sent to any specified ArcGIS feature layers.
 */
export class ObservationProcessor {

    /**
     * The number of seconds to sleep before checking for new observations.
     */
    _intervalSeconds: number;

    /**
     * The max number of records to send to arc per request.
     */
    _batchSize: number;

    /**
     * True if the processor is currently active, false otherwise.
     */
    _isRunning = false;

    /**
     * The next timeout, use this to cancel the next one if the processor is stopped.
     */
    _nextTimeout: NodeJS.Timeout | undefined;

    /**
     * Used to get all the active events.
     */
    _eventRepo: MageEventRepository;

    /**
     * The last time we checked for new/modified observations.
     */
    _lastTimeStamp: number;

    /**
     * Used to get new observations.
     */
    _obsRepos: ObservationRepositoryForEvent;

    /**
     * Used to log to the console.
     */
    _console: Console;

    /**
     * Used to convert observations to json string that can be sent to an arcgis server.
     */
    _transformer: ObservationsTransformer;

    /**
     * Sends the json string of observations to any configured ArcGIS feature layer.
     */
    _sender: ObservationsSender;

    /**
     * Constructor.
     * @param config The plugins configuration.
     * @param eventRepo Used to get all the active events.
     * @param obsRepo Used to get new observations.
     * @param console Used to log to the console.
     */
    constructor(config: ArcGISPluginConfig, eventRepo: MageEventRepository, obsRepos: ObservationRepositoryForEvent, console: Console) {
        this._intervalSeconds = config.intervalSeconds;
        this._batchSize = config.batchSize;
        this._eventRepo = eventRepo;
        this._obsRepos = obsRepos;
        this._lastTimeStamp = Date.now();
        this._console = console;
        this._transformer = new ObservationsTransformer(this._console);
        this._sender = new ObservationsSender(config, console);
    }

    /**
     * Starts the processor.
     */
    start() {
        this._isRunning = true;
        this.processAndScheduleNext();
    }

    /**
     * Stops the processor.
     */
    stop() {
        this._isRunning = false;
        clearTimeout(this._nextTimeout);
    }

    /**
     * Processes any new observations and then schedules its next run if it hasn't been stopped.
     */
    private async processAndScheduleNext() {
        if (this._isRunning) {
            this._console.info('ArcGIS plugin processing new observations...');
            const queryTime = this._lastTimeStamp;
            this._lastTimeStamp = Date.now();
            const activeEvents = await this._eventRepo.findActiveEvents();
            for (const activeEvent of activeEvents) {
                this._console.info('ArcGIS getting newest observations for event ' + activeEvent.name);
                const obsRepo = await this._obsRepos(activeEvent.id);
                const pagingSettings = {
                    pageSize: this._batchSize,
                    pageIndex: 0,
                    includeTotalCount: true
                }
                let totalCount = 0;
                let morePages = true;
                while (morePages) {
                    morePages = await this.queryAndSend(obsRepo, pagingSettings, queryTime, totalCount);
                }
            }
            if (this._isRunning) {
                this._nextTimeout = setTimeout(() => { this.processAndScheduleNext() }, this._intervalSeconds * 1000);
            }
        }
    }

    /**
     * Queries for new observations and sends them to any configured arc servers.
     * @param obsRepo The observation repo for an event.
     * @param pagingSettings Current paging settings.
     * @param queryTime The time to query for.
     * @param totalProcessed An output parameter that keeps track of the total number of observations currently processed.
     * @returns True if this needs to be called again to get the next page of observations.
     */
    private async queryAndSend(obsRepo: EventScopedObservationRepository, pagingSettings: PagingParameters, queryTime: number, totalProcessed: number): Promise<boolean> {
        let morePages = false;

        let latestObs = await obsRepo.findLastModifiedAfter(queryTime, pagingSettings);
        if (latestObs != null && latestObs.totalCount != null && latestObs.totalCount > 0) {
            if (pagingSettings.pageIndex == 0) {
                this._console.info('ArcGIS newest observation count ' + latestObs.totalCount);
            }
            const jsonObservations = this._transformer.transform(latestObs.items);
            this._console.info('ArcGIS json ' + jsonObservations);
            this._sender.send(jsonObservations);
            totalProcessed += latestObs.items.length;
            pagingSettings.pageIndex++;
            if (totalProcessed < latestObs.totalCount) {
                morePages = true;
            }
        } else {
            this._console.info('ArcGIS no new observations')
        }

        return morePages;
    }
}