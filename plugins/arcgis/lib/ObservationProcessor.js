"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservationProcessor = void 0;
const ObservationsTransformer_1 = require("./ObservationsTransformer");
/**
 * Class that wakes up at a certain configured interval and processes any new observations that can be
 * sent to any specified ArcGIS feature layers.
 */
class ObservationProcessor {
    /**
     * Constructor.
     * @param config The plugins configuration.
     * @param eventRepo Used to get all the active events.
     * @param obsRepo Used to get new observations.
     * @param console Used to log to the console.
     */
    constructor(config, eventRepo, obsRepos, console) {
        /**
         * True if the processor is currently active, false otherwise.
         */
        this._isRunning = false;
        this._intervalSeconds = config.intervalSeconds;
        this._batchSize = config.batchSize;
        this._eventRepo = eventRepo;
        this._obsRepos = obsRepos;
        this._lastTimeStamp = Date.now();
        this._console = console;
        this._transformer = new ObservationsTransformer_1.ObservationsTransformer();
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
    processAndScheduleNext() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isRunning) {
                this._console.info('ArcGIS plugin processing new observations...');
                const queryTime = this._lastTimeStamp;
                this._lastTimeStamp = Date.now();
                const activeEvents = yield this._eventRepo.findActiveEvents();
                for (const activeEvent of activeEvents) {
                    this._console.info('ArcGIS getting newest observations for event ' + activeEvent.name);
                    const obsRepo = yield this._obsRepos(activeEvent.id);
                    const pagingSettings = {
                        pageSize: this._batchSize,
                        pageIndex: 0,
                        includeTotalCount: true
                    };
                    let latestObs = yield obsRepo.findLastModifiedAfter(queryTime, pagingSettings);
                    if (latestObs != null && latestObs.totalCount != null) {
                        this._console.info('ArcGIS newest observation count ' + latestObs.totalCount);
                        let jsonObservations = this._transformer.transform(latestObs.items);
                        this._console.info('ArcGIS json ' + jsonObservations);
                        for (let i = 0, j = 0; latestObs != null && latestObs.totalCount != null && i < latestObs.totalCount; i++, j++) {
                            if (j >= latestObs.pageSize) {
                                j = 0;
                                pagingSettings.pageIndex++;
                                latestObs = yield obsRepo.findLastModifiedAfter(queryTime, pagingSettings);
                                let jsonObservations = this._transformer.transform(latestObs.items);
                                this._console.info('ArcGIS json ' + jsonObservations);
                            }
                            if (latestObs != null && latestObs.totalCount != null) {
                                const observation = latestObs.items[j];
                                if (observation.geometry.type == 'Point') {
                                    const pointgeom = observation.geometry;
                                    this._console.info('ArcGIS new point at ' + pointgeom.coordinates + ' with id ' + observation.id);
                                }
                            }
                        }
                    }
                    else {
                        this._console.info('ArcGIS no new observations');
                    }
                }
                if (this._isRunning) {
                    this._nextTimeout = setTimeout(() => { this.processAndScheduleNext(); }, this._intervalSeconds * 1000);
                }
            }
        });
    }
}
exports.ObservationProcessor = ObservationProcessor;
//# sourceMappingURL=ObservationProcessor.js.map