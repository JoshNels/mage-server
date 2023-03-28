import { InitPluginHook, PluginStateRepositoryToken } from '@ngageoint/mage.service/lib/plugins.api'
import { GetAppRequestContext, WebRoutesHooks } from '@ngageoint/mage.service/lib/plugins.api/plugins.api.web'
import { ObservationRepositoryToken } from '@ngageoint/mage.service/lib/plugins.api/plugins.api.observations'
import { MageEventRepositoryToken } from '@ngageoint/mage.service/lib/plugins.api/plugins.api.events'
import { UserRepositoryToken } from '@ngageoint/mage.service/lib/plugins.api/plugins.api.users'
import { SettingPermission } from '@ngageoint/mage.service/lib/entities/authorization/entities.permissions'
import express from 'express'
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from './ArcGISPluginConfig'
import { ObservationProcessor } from './ObservationProcessor'

const logPrefix = '[mage.arcgis]'
const logMethods = ['log', 'debug', 'info', 'warn', 'error'] as const
const consoleOverrides = logMethods.reduce((overrides, fn) => {
  return {
    ...overrides,
    [fn]: {
      writable: false,
      value: (...args: any[]) => {
        globalThis.console[fn](new Date().toISOString(), '-', logPrefix, ...args)
      }
    }
  } as PropertyDescriptorMap
}, {} as PropertyDescriptorMap)
const console = Object.create(globalThis.console, consoleOverrides) as Console

const InjectedServices = {
  stateRepo: PluginStateRepositoryToken,
  eventRepo: MageEventRepositoryToken,
  obsRepoForEvent: ObservationRepositoryToken,
  userRepo: UserRepositoryToken
}

/**
 * The MAGE ArcGIS Plugin finds new MAGE observations and if configured to send the observations
 * to an ArcGIS server, it will then transform the observation to an ArcGIS feature and
 * send them to the configured ArcGIS feature layer.
 */
const arcgisPluginHooks: InitPluginHook<typeof InjectedServices> = {
  inject: {
    stateRepo: PluginStateRepositoryToken,
    eventRepo: MageEventRepositoryToken,
    obsRepoForEvent: ObservationRepositoryToken,
    userRepo: UserRepositoryToken
  },
  init: async (services): Promise<WebRoutesHooks> => {
    console.info('Intializing ArcGIS plugin...')
    const { stateRepo, eventRepo, obsRepoForEvent, userRepo } = services
    const processor = new ObservationProcessor(stateRepo, eventRepo, obsRepoForEvent, userRepo, console);
    processor.start();
    return {
      webRoutes(requestContext: GetAppRequestContext): express.Router {
        const routes = express.Router()
          .use(express.json())
          .use(async (req, res, next) => {
            const context = requestContext(req)
            const user = context.requestingPrincipal()
            if (!user.role.permissions.find(x => x === SettingPermission.UPDATE_SETTINGS)) {
              return res.status(403).json({ message: 'unauthorized' })
            }
            next()
          })
        routes.route('/config')
          .get(async (req, res, next) => {
            console.info('Getting ArcGIS plugin config...')
            const config = await processor.safeGetConfig();
            res.json(config)
          })
          .put(async (req, res, next) => {
            console.info('Applying ArcGIS plugin config...')
            const bodyConfig = req.body as any
            const configPatch: Partial<ArcGISPluginConfig> = {
              enabled: typeof bodyConfig.enabled === 'boolean' ? bodyConfig.enabled : undefined,
              batchSize: typeof bodyConfig.batchSize === 'number' ? bodyConfig.batchSize : undefined,
              intervalSeconds: typeof bodyConfig.intervalSeconds === 'number' ? bodyConfig.intervalSeconds : undefined,
              featureServices: Array.isArray(bodyConfig.featureServices) ?
                bodyConfig.thumbnailSizes.reduce((sizes: number[], size: any) => {
                  return typeof size === 'number' ? [...sizes, size] : sizes
                }, [] as number[])
                : []
            }
          })
        return routes
      }
    }
  }
}

export = arcgisPluginHooks