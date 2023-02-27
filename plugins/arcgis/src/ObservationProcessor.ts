import { PagingParameters } from '@ngageoint/mage.service/lib/entities/entities.global';
import { MageEventRepository } from '@ngageoint/mage.service/lib/entities/events/entities.events';
import { EventScopedObservationRepository, ObservationRepositoryForEvent } from '@ngageoint/mage.service/lib/entities/observations/entities.observations';
import { UserRepository } from '@ngageoint/mage.service/lib/entities/users/entities.users';
import { ArcGISPluginConfig } from './ArcGISPluginConfig';
import { ObservationsTransformer } from './ObservationsTransformer'
import { ObservationsSender } from './ObservationsSender';
import { ArcObjects } from './ArcObjects'
import { ObservationBinner } from './ObservationBinner';
import { LayerQuerier } from './LayerQuerier';
import { LayerInfo } from './LayerInfo';
import { FeatureLayerProcessor } from './FeatureLayerProcessor';
import { EventTransform } from './EventTransform';
import { GeometryChangedHandler } from './GeometryChangedHandler';
import { EventDeletionHandler } from './EventDeletionHandler';

/**
 * Class that wakes up at a certain configured interval and processes any new observations that can be
 * sent to any specified ArcGIS feature layers.
 */
export class ObservationProcessor {

    /**
     * The number of seconds to sleep before checking for new observations.
     */
    private _intervalSeconds: number;

    /**
     * The max number of records to send to arc per request.
     */
    private _batchSize: number;

    /**
     * True if the processor is currently active, false otherwise.
     */
    private _isRunning = false;

    /**
     * The next timeout, use this to cancel the next one if the processor is stopped.
     */
    private _nextTimeout: NodeJS.Timeout | undefined;

    /**
     * Used to get all the active events.
     */
    private _eventRepo: MageEventRepository;

    /**
     * The last time we checked for new/modified observations.
     */
    private _lastTimeStamp: number;

    /**
     * Used to get new observations.
     */
    private _obsRepos: ObservationRepositoryForEvent;

    /**
     * Used to get user information.
     */
    private _userRepo: UserRepository;

    /**
     * Used to log to the console.
     */
    private _console: Console;

    /**
     * Used to convert observations to json string that can be sent to an arcgis server.
     */
    private _transformer: ObservationsTransformer;

    /**
     * Gets info about certain feature layers.
     */
    private _layerQuerier: LayerQuerier;

    /**
     * Contains the different feature layers to send observations too.
     */
    private _config: ArcGISPluginConfig;

    /**
     * Sends observations to a single feature layer.
     */
    private _layerProcessors: FeatureLayerProcessor[];

    /**
     * True if this is a first run at updating arc feature layers.  If so we need to make sure the layers are
     * all up to date.
     */
    private _firstRun: boolean;

    /**
     * Handles removing observation from previous layers when an observation geometry changes.
     */
    private _geometryChangeHandler: GeometryChangedHandler;

    private _eventDeletionHandler: EventDeletionHandler;

    /**
     * Constructor.
     * @param config The plugins configuration.
     * @param eventRepo Used to get all the active events.
     * @param obsRepo Used to get new observations.
     * @param userRepo Used to get user information.
     * @param console Used to log to the console.
     */
    constructor(config: ArcGISPluginConfig, eventRepo: MageEventRepository, obsRepos: ObservationRepositoryForEvent, userRepo: UserRepository, console: Console) {
        this._config = config;
        this._intervalSeconds = config.intervalSeconds;
        this._batchSize = config.batchSize;
        this._eventRepo = eventRepo;
        this._obsRepos = obsRepos;
        this._userRepo = userRepo;
        this._lastTimeStamp = 0;
        this._console = console;
        this._transformer = new ObservationsTransformer(config, console);
        this._layerProcessors = [];
        this._layerQuerier = new LayerQuerier(console);
        this._firstRun = true;
        this._geometryChangeHandler = new GeometryChangedHandler(this._transformer);
        this._eventDeletionHandler = new EventDeletionHandler(this._console, this._config);
    }

    /**
     * Starts the processor.
     */
    start() {
        this._isRunning = true;
        this._firstRun = true;
        this.getLayerInfos();
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
     * Gets information on all the configured features layers.
     */
    private getLayerInfos() {
        for (let i = 0; i < this._config.featureLayers.length; i++) {
            const url = this._config.featureLayers[i];
            this._layerQuerier.queryLayerInfo(url, (info: LayerInfo) => this.handleLayerInfo(info));
        }
    }

    /**
     * Called when information on a feature layer is returned from an arc server.
     * @param info The information on a layer.
     */
    private handleLayerInfo(info: LayerInfo) {
        const layerProcessor = new FeatureLayerProcessor(info, this._config, this._console);
        this._layerProcessors.push(layerProcessor);
    }

    /**
     * Processes any new observations and then schedules its next run if it hasn't been stopped.
     */
    private async processAndScheduleNext() {
        if (this._isRunning) {
            if (this._layerProcessors.length > 0) {
                this._console.info('ArcGIS plugin checking for any pending updates or adds');
                for(const layerProcessor of this._layerProcessors) {
                    layerProcessor.processPendingUpdates();
                }
                this._console.info('ArcGIS plugin processing new observations...');
                const queryTime = this._lastTimeStamp;
                this._lastTimeStamp = Date.now();
                const activeEvents = await this._eventRepo.findActiveEvents();
                this._eventDeletionHandler.checkForEventDeletion(activeEvents, this._layerProcessors, this._firstRun);
                for (const activeEvent of activeEvents) {
                    this._console.info('ArcGIS getting newest observations for event ' + activeEvent.name);
                    const obsRepo = await this._obsRepos(activeEvent.id);
                    const pagingSettings = {
                        pageSize: this._batchSize,
                        pageIndex: 0,
                        includeTotalCount: true
                    }
                    let morePages = true;
                    let numberLeft = 0;
                    while (morePages) {
                        numberLeft = await this.queryAndSend(obsRepo, pagingSettings, queryTime, numberLeft);
                        morePages = numberLeft > 0;
                    }
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
     * @param numberLeft The number of observations left to query and send to arc.
     * @returns The number of observations still needing to be queried and sent to arc.
     */
    private async queryAndSend(obsRepo: EventScopedObservationRepository, pagingSettings: PagingParameters, queryTime: number, numberLeft: number): Promise<number> {
        let newNumberLeft = numberLeft;

        let latestObs = await obsRepo.findLastModifiedAfter(queryTime, pagingSettings);
        if (latestObs != null && latestObs.totalCount != null && latestObs.totalCount > 0) {
            if (pagingSettings.pageIndex == 0) {
                this._console.info('ArcGIS newest observation count ' + latestObs.totalCount);
                newNumberLeft = latestObs.totalCount;
            }
            const observations = latestObs.items
            const mageEvent = await this._eventRepo.findById(obsRepo.eventScope)
            const eventTransform = new EventTransform(this._config, mageEvent)
            const arcObjects = new ArcObjects()
            this._geometryChangeHandler.checkForGeometryChange(observations, arcObjects, this._layerProcessors, this._firstRun);
            for (let i = 0; i < observations.length; i++) {
                const observation = observations[i]
                let deletion = false
                if (observation.states.length > 0) {
                    deletion = observation.states[0].name.startsWith('archive')
                }
                if (deletion) {
                    const arcObservation = this._transformer.createObservation(observation)
                    arcObjects.deletions.push(arcObservation)
                } else {
                    let user = null
                    if (observation.userId != null) {
                        user = await this._userRepo.findById(observation.userId)
                    }
                    const arcObservation = this._transformer.transform(observation, eventTransform, user)
                    arcObjects.add(arcObservation)
                }
            }
            arcObjects.firstRun = this._firstRun;
            this._firstRun = false;
            for(const layerProcessor of this._layerProcessors) {
                layerProcessor.processArcObjects(arcObjects);
            }
            newNumberLeft -= latestObs.items.length;
            pagingSettings.pageIndex++;
        } else {
            this._console.info('ArcGIS no new observations')
        }

        return newNumberLeft;
    }
}