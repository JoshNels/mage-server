import { PagingParameters } from '@ngageoint/mage.service/lib/entities/entities.global';
import { MageEventRepository } from '@ngageoint/mage.service/lib/entities/events/entities.events';
import { EventScopedObservationRepository, ObservationRepositoryForEvent } from '@ngageoint/mage.service/lib/entities/observations/entities.observations';
import { UserRepository } from '@ngageoint/mage.service/lib/entities/users/entities.users';
import { ArcGISPluginConfig } from './ArcGISPluginConfig';
import { ObservationsTransformer } from './ObservationsTransformer'
import { ObservationsSender } from './ObservationsSender';
import { ArcObjects } from './ArcObjects'
import { ObservationBins } from './ObservationBins';
import { ObservationBinner } from './ObservationBinner';
import { LayerQuerier } from './LayerQuerier';
import { LayerInfo } from './LayerInfo';
import { EventTransform } from './EventTransform';

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
     * Used to get user information.
     */
    _userRepo: UserRepository;

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
     * Seperates the adds from the updates regarding observations.
     */
    _binner: ObservationBinner;

    /**
     * Gets info about certain feature layers.
     */
    _layerQuerier: LayerQuerier;

    /**
     * Contains the different feature layers to send observations too.
     */
    _config: ArcGISPluginConfig;

    /**
     * Contains information about all layers we are sending observations to.
     */
    _layerInfos: LayerInfo[];

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
        this._sender = new ObservationsSender(config.featureLayers[0], config.attachmentModifiedTolerance, console);
        this._binner = new ObservationBinner(config.featureLayers[0], config.observationIdField, console);
        this._layerInfos = [];
        this._layerQuerier = new LayerQuerier(console);
    }

    /**
     * Starts the processor.
     */
    start() {
        this._isRunning = true;
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
        this._layerInfos.push(info);
    }

    /**
     * Processes any new observations and then schedules its next run if it hasn't been stopped.
     */
    private async processAndScheduleNext() {
        if (this._isRunning) {
            if (this._layerInfos.length > 0) {
                this._console.info('ArcGIS plugin checking for any pending updates or adds');
                const bins = this._binner.pendingUpdates();
                this.send(bins);
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
            for (let i = 0; i < observations.length; i++) {
                const observation = observations[i]
                let user = null
                if (observation.userId != null) {
                    user = await this._userRepo.findById(observation.userId)
                }
                const arcObservation = this._transformer.transform(observation, eventTransform, user)
                arcObjects.add(arcObservation)
            }
            const bins = this._binner.sortEmOut(arcObjects);
            this.send(bins);
            newNumberLeft -= latestObs.items.length;
            pagingSettings.pageIndex++;
        } else {
            this._console.info('ArcGIS no new observations')
        }

        return newNumberLeft;
    }

    /**
     * Sends either the updates to observations or new observations to the arc server.
     * @param bins Contains both new and updated observations.
     */
    private send(bins: ObservationBins) {
        if (!bins.adds.isEmpty()) {
            this._sender.sendAdds(bins.adds);
        }
        if (!bins.updates.isEmpty()) {
            this._sender.sendUpdates(bins.updates);
        }
    }

}