import { PagingParameters } from "@ngageoint/mage.service/lib/entities/entities.global";
import { MageEventRepository } from "@ngageoint/mage.service/lib/entities/events/entities.events";
import { ObservationRepositoryForEvent } from "@ngageoint/mage.service/lib/entities/observations/entities.observations";
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
    _intervalSeconds : number;

    /**
     * The max number of records to send to arc per request.
     */
    _batchSize : number;

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
        this._transformer = new ObservationsTransformer();
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
        if(this._isRunning) {
            this._console.info('ArcGIS plugin processing new observations...');
            const queryTime = this._lastTimeStamp;
            this._lastTimeStamp = Date.now();
            const activeEvents = await this._eventRepo.findActiveEvents();
            for(const activeEvent of activeEvents) {
                this._console.info('ArcGIS getting newest observations for event ' + activeEvent.name);
                const obsRepo = await this._obsRepos(activeEvent.id);
                const pagingSettings = {
                    pageSize: this._batchSize,
                    pageIndex: 0,
                    includeTotalCount: true
                }
                let latestObs = await obsRepo.findLastModifiedAfter(queryTime, pagingSettings);
                if(latestObs != null && latestObs.totalCount != null) {
                    this._console.info('ArcGIS newest observation count ' + latestObs.totalCount);
                    let jsonObservations = this._transformer.transform(latestObs.items);
                    this._console.info('ArcGIS json ' + jsonObservations);
                    this._sender.send(jsonObservations);
                    for (let i = 0, j = 0; latestObs != null && latestObs.totalCount != null && i < latestObs.totalCount; i++, j++) {
                        if(j >= latestObs.pageSize) {
                            j = 0;
                            pagingSettings.pageIndex++;
                            latestObs = await obsRepo.findLastModifiedAfter(queryTime, pagingSettings)
                            jsonObservations = this._transformer.transform(latestObs.items);
                            this._console.info('ArcGIS json ' + jsonObservations);
                            this._sender.send(jsonObservations);
                        }

                        if(latestObs != null && latestObs.totalCount != null) {
                            const observation = latestObs.items[j];
                            if(observation.geometry.type == 'Point') {
                                const pointgeom = observation.geometry as Point;
                                this._console.info('ArcGIS new point at ' + pointgeom.coordinates + ' with id ' + observation.id);
                            }
                        }
                    }
                } else {
                    this._console.info('ArcGIS no new observations')
                }
            }
            if(this._isRunning) {
                this._nextTimeout = setTimeout(() => {this.processAndScheduleNext()}, this._intervalSeconds * 1000);
            }
        }
    }
}