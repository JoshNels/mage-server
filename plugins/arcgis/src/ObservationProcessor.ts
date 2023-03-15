import { PagingParameters } from '@ngageoint/mage.service/lib/entities/entities.global';
import { MageEventRepository } from '@ngageoint/mage.service/lib/entities/events/entities.events';
import { EventScopedObservationRepository, ObservationRepositoryForEvent } from '@ngageoint/mage.service/lib/entities/observations/entities.observations';
import { UserRepository } from '@ngageoint/mage.service/lib/entities/users/entities.users';
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from './ArcGISPluginConfig';
import { ObservationsTransformer } from './ObservationsTransformer'
import { ArcObjects } from './ArcObjects'
import { FeatureService } from './FeatureService';
import { FeatureServiceResult, FeatureLayer } from './FeatureServiceResult';
import { LayerInfo } from './LayerInfo';
import { LayerInfoResult } from "./LayerInfoResult";
import { FeatureLayerProcessor } from './FeatureLayerProcessor';
import { EventTransform } from './EventTransform';
import { GeometryChangedHandler } from './GeometryChangedHandler';
import { EventDeletionHandler } from './EventDeletionHandler';
import { EventLayerProcessorOrganizer } from './EventLayerProcessorOrganizer';
import { FeatureServiceConfig } from "./ArcGISConfig"
import { PluginStateRepository } from '@ngageoint/mage.service/lib/plugins.api'

/**
 * Class that wakes up at a certain configured interval and processes any new observations that can be
 * sent to any specified ArcGIS feature layers.
 */
export class ObservationProcessor {

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
     * Gets feature service layer information.
     */
    private _featureService: FeatureService;

    /**
     * Contains the different feature layers to send observations too.
     */
    private _stateRepo: PluginStateRepository<ArcGISPluginConfig>;

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

    /**
     * Handles removing observations when an event is deleted.
     */
    private _eventDeletionHandler: EventDeletionHandler;

    /**
     * Maps the events to the processor they are synching data for.
     */
    private _organizer: EventLayerProcessorOrganizer;

    /**
     * Constructor.
     * @param stateRepo Access totThe plugins configuration.
     * @param eventRepo Used to get all the active events.
     * @param obsRepo Used to get new observations.
     * @param userRepo Used to get user information.
     * @param console Used to log to the console.
     */
    constructor(stateRepo: PluginStateRepository<ArcGISPluginConfig>, eventRepo: MageEventRepository, obsRepos: ObservationRepositoryForEvent, userRepo: UserRepository, console: Console) {
        this._stateRepo = stateRepo;
        this._eventRepo = eventRepo;
        this._obsRepos = obsRepos;
        this._userRepo = userRepo;
        this._lastTimeStamp = 0;
        this._console = console;
        this._transformer = new ObservationsTransformer(defaultArcGISPluginConfig, console);
        this._layerProcessors = [];
        this._featureService = new FeatureService(console);
        this._firstRun = true;
        this._geometryChangeHandler = new GeometryChangedHandler(this._transformer);
        this._eventDeletionHandler = new EventDeletionHandler(this._console, defaultArcGISPluginConfig);
        this._organizer = new EventLayerProcessorOrganizer();
    }

    /**
     * Gets the current configuration from the database.
     * @returns The current configuration from the database.
     */
    async safeGetConfig(): Promise<ArcGISPluginConfig> {
        return await this._stateRepo.get().then(x => !!x ? x : this._stateRepo.put(defaultArcGISPluginConfig))
    }

    /**
     * Starts the processor.
     */
    async start() {
        this._isRunning = true;
        this._firstRun = true;
        const config = await this.safeGetConfig();
        this._transformer.setConfig(config);
        this._eventDeletionHandler.setConfig(config);
        this.getFeatureServiceLayers(config);
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
     * Gets information on all the configured features service layers.
     * @param config The plugins configuration.
     */
    private getFeatureServiceLayers(config: ArcGISPluginConfig) {
        for (const service of config.featureServices) {
            this._featureService.queryFeatureService(service, (featureService: FeatureServiceResult, featureServiceConfig: FeatureServiceConfig) => this.handleFeatureService(featureService, featureServiceConfig, config))
        }
    }

    /**
     * Called when information on a feature service is returned from an arc server.
     * @param featureService The feature service.
     * @param featureServiceConfig The feature service config.
     * @param config The plugin configuration.
     */
    private async handleFeatureService(featureService: FeatureServiceResult, featureServiceConfig: FeatureServiceConfig, config: ArcGISPluginConfig) {

        if (featureService.layers != null) {

            const serviceLayers = new Map<any, FeatureLayer>()

            let maxId = -1
            for (const layer of featureService.layers) {
                serviceLayers.set(layer.id, layer)
                serviceLayers.set(layer.name, layer)
                maxId = Math.max(maxId, layer.id)
            }

            for (const layerConfig of featureServiceConfig.layers) {

                const featureLayer = serviceLayers.get(layerConfig.layer)

                let layerId
                if (featureLayer == null) {
                    layerId = ++maxId
                    // TODO: layer needs to be created with layer id
                    throw new Error('TODO: layer needs to be created with layer id ' + layerId)
                } else {
                    layerId = featureLayer.id
                }

                const url = featureServiceConfig.url + '/' + layerId
                const eventNames: string[] = []
                const events = layerConfig.events
                if (events != null) {
                    for (const event of events) {
                        const eventId = Number(event);
                        if (isNaN(eventId)) {
                            eventNames.push(String(event));
                        } else {
                            const mageEvent = await this._eventRepo.findById(eventId)
                            if (mageEvent != null) {
                                eventNames.push(mageEvent.name);
                            }
                        }
                    }
                }
                this._featureService.queryLayerInfo(url, eventNames, (url: string, events: string[], layerInfo: LayerInfoResult) => this.handleLayerInfo(url, events, layerInfo, config));
            }

        }
    }

    /**
     * Called when information on a feature layer is returned from an arc server.
     * @param url The url to the layer.
     * @param events The events that are synching to the layer.
     * @param layerInfo The information on a layer.
     * @param config The plugins configuration.
     */
    private handleLayerInfo(url: string, events: string[], layerInfo: LayerInfoResult, config: ArcGISPluginConfig) {
        if (layerInfo.geometryType != null) {
            const info = new LayerInfo(url, events, layerInfo)
            const layerProcessor = new FeatureLayerProcessor(info, config, this._console);
            this._layerProcessors.push(layerProcessor);
        }
    }

    /**
     * Processes any new observations and then schedules its next run if it hasn't been stopped.
     */
    private async processAndScheduleNext() {
        const config = await this.safeGetConfig();
        if (this._isRunning) {
            if (this._layerProcessors.length > 0) {
                this._console.info('ArcGIS plugin checking for any pending updates or adds');
                for (const layerProcessor of this._layerProcessors) {
                    layerProcessor.processPendingUpdates();
                }
                this._console.info('ArcGIS plugin processing new observations...');
                const queryTime = this._lastTimeStamp;
                this._lastTimeStamp = Date.now();
                const activeEvents = await this._eventRepo.findActiveEvents();
                this._eventDeletionHandler.checkForEventDeletion(activeEvents, this._layerProcessors, this._firstRun);
                const eventsToProcessors = this._organizer.organize(activeEvents, this._layerProcessors);
                for (const pair of eventsToProcessors) {
                    this._console.info('ArcGIS getting newest observations for event ' + pair.event.name);
                    const obsRepo = await this._obsRepos(pair.event.id);
                    const pagingSettings = {
                        pageSize: config.batchSize,
                        pageIndex: 0,
                        includeTotalCount: true
                    }
                    let morePages = true;
                    let numberLeft = 0;
                    while (morePages) {
                        numberLeft = await this.queryAndSend(config, pair.featureLayerProcessors, obsRepo, pagingSettings, queryTime, numberLeft);
                        morePages = numberLeft > 0;
                    }
                }
                this._firstRun = false;
            }
            if (this._isRunning) {
                let interval = config.intervalSeconds;
                if (this._firstRun) {
                    interval = config.startupIntervalSeconds;
                } else {
                    for (const layerProcessor of this._layerProcessors) {
                        if (layerProcessor.hasPendingUpdates()) {
                            interval = config.updateIntervalSeconds;
                            break;
                        }
                    }
                }
                this._nextTimeout = setTimeout(() => { this.processAndScheduleNext() }, interval * 1000);
            }
        }
    }

    /**
     * Queries for new observations and sends them to any configured arc servers.
     * @param config The plugin configuration.
     * @param layerProcessors The layer processors to use when processing arc objects.
     * @param obsRepo The observation repo for an event.
     * @param pagingSettings Current paging settings.
     * @param queryTime The time to query for.
     * @param numberLeft The number of observations left to query and send to arc.
     * @returns The number of observations still needing to be queried and sent to arc.
     */
    private async queryAndSend(config: ArcGISPluginConfig, layerProcessors: FeatureLayerProcessor[], obsRepo: EventScopedObservationRepository, pagingSettings: PagingParameters, queryTime: number, numberLeft: number): Promise<number> {
        let newNumberLeft = numberLeft;

        let latestObs = await obsRepo.findLastModifiedAfter(queryTime, pagingSettings);
        if (latestObs != null && latestObs.totalCount != null && latestObs.totalCount > 0) {
            if (pagingSettings.pageIndex == 0) {
                this._console.info('ArcGIS newest observation count ' + latestObs.totalCount);
                newNumberLeft = latestObs.totalCount;
            }
            const observations = latestObs.items
            const mageEvent = await this._eventRepo.findById(obsRepo.eventScope)
            const eventTransform = new EventTransform(config, mageEvent)
            const arcObjects = new ArcObjects()
            this._geometryChangeHandler.checkForGeometryChange(observations, arcObjects, layerProcessors, this._firstRun);
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
            for (const layerProcessor of layerProcessors) {
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