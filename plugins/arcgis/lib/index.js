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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const plugins_api_observations_1 = require("@ngageoint/mage.service/lib/plugins.api/plugins.api.observations");
const plugins_api_events_1 = require("@ngageoint/mage.service/lib/plugins.api/plugins.api.events");
const entities_permissions_1 = require("@ngageoint/mage.service/lib/entities/authorization/entities.permissions");
const express_1 = __importDefault(require("express"));
const ArcGISPluginConfig_1 = require("./ArcGISPluginConfig");
const ObservationProcessor_1 = require("./ObservationProcessor");
const logPrefix = '[mage.arcgis]';
const logMethods = ['log', 'debug', 'info', 'warn', 'error'];
const consoleOverrides = logMethods.reduce((overrides, fn) => {
    return Object.assign(Object.assign({}, overrides), { [fn]: {
            writable: false,
            value: (...args) => {
                globalThis.console[fn](new Date().toISOString(), '-', logPrefix, ...args);
            }
        } });
}, {});
const console = Object.create(globalThis.console, consoleOverrides);
const InjectedServices = {
    eventRepo: plugins_api_events_1.MageEventRepositoryToken,
    obsRepoForEvent: plugins_api_observations_1.ObservationRepositoryToken
};
/**
 * The MAGE ArcGIS Plugin finds new MAGE observations and if configured to send the observations
 * to an ArcGIS server, it will then transform the observation to an ArcGIS feature and
 * send them to the configured ArcGIS feature layer.
 */
const imagePluginHooks = {
    inject: {
        eventRepo: plugins_api_events_1.MageEventRepositoryToken,
        obsRepoForEvent: plugins_api_observations_1.ObservationRepositoryToken,
    },
    init: (services) => __awaiter(void 0, void 0, void 0, function* () {
        console.info('Intializing ArcGIS plugin...');
        const { eventRepo, obsRepoForEvent } = services;
        const processor = new ObservationProcessor_1.ObservationProcessor(ArcGISPluginConfig_1.defaultArcGISPluginConfig, eventRepo, obsRepoForEvent, console);
        processor.start();
        return {
            webRoutes(requestContext) {
                const routes = express_1.default.Router()
                    .use(express_1.default.json())
                    .use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    const context = requestContext(req);
                    const user = context.requestingPrincipal();
                    if (!user.role.permissions.find(x => x === entities_permissions_1.SettingPermission.UPDATE_SETTINGS)) {
                        return res.status(403).json({ message: 'unauthorized' });
                    }
                    next();
                }));
                routes.route('/config')
                    .get((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    console.info('Getting ArcGIS plugin config...');
                    const config = ArcGISPluginConfig_1.defaultArcGISPluginConfig;
                    res.json(config);
                }))
                    .put((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    console.info('Applying ArcGIS plugin config...');
                    const bodyConfig = req.body;
                    const configPatch = {
                        enabled: typeof bodyConfig.enabled === 'boolean' ? bodyConfig.enabled : undefined,
                        batchSize: typeof bodyConfig.batchSize === 'number' ? bodyConfig.batchSize : undefined,
                        intervalSeconds: typeof bodyConfig.intervalSeconds === 'number' ? bodyConfig.intervalSeconds : undefined,
                        featureLayers: Array.isArray(bodyConfig.featureLayers) ?
                            bodyConfig.thumbnailSizes.reduce((sizes, size) => {
                                return typeof size === 'number' ? [...sizes, size] : sizes;
                            }, [])
                            : []
                    };
                }));
                return routes;
            }
        };
    })
};
module.exports = imagePluginHooks;
//# sourceMappingURL=index.js.map