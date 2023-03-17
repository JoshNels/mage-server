import { ArcGISPluginConfig } from "./ArcGISPluginConfig"
import { FeatureServiceConfig, FeatureLayerConfig } from "./ArcGISConfig"
import { MageEvent, MageEventRepository } from '@ngageoint/mage.service/lib/entities/events/entities.events'

/**
 * Administers hosted feature services such as layer creation and updates.
 */
export class FeatureServiceAdmin {

    /**
     * ArcGIS configuration.
     */
    private _config: ArcGISPluginConfig

    /**
     * Used to log to the console.
     */
    private _console: Console

    /**
     * Constructor.
     * @param config The plugins configuration.
     * @param console Used to log to the console.
     */
    constructor(config: ArcGISPluginConfig, console: Console) {
        this._config = config
        this._console = console
    }

    async createLayer(service: FeatureServiceConfig, layer: FeatureLayerConfig, nextId: number, eventRepo: MageEventRepository): Promise<number | null> {

        let layerName = null
        let layerId = 0

        const layerIdentifier = layer.layer
        const layerIdentifierNumber = Number(layerIdentifier)
        if (isNaN(layerIdentifierNumber)) {
            layerName = String(layerIdentifier)
            layerId = nextId
        } else {
            layerId = layerIdentifierNumber
        }

        const events = await this.layerEvents(layer, eventRepo)

        if (layerName == null) {
            layerName = this.layerName(events)
        }

        // TODO Determine the layer attribute fields from the events

        // TODO Create the layer

        return layerId
    }

    private async layerEvents(layer: FeatureLayerConfig, eventRepo: MageEventRepository): Promise<MageEvent[]> {

        const layerEvents: Set<string> = new Set()
        if (layer.events != null && layer.events.length > 0) {
            for (const layerEvent of layerEvents) {
                layerEvents.add(layerEvent)
            }
        }

        let mageEvents
        if (layerEvents.size > 0) {
            mageEvents = await eventRepo.findAll()
        } else {
            mageEvents = await eventRepo.findActiveEvents()
        }

        const events: MageEvent[] = []
        for (const mageEvent of mageEvents) {
            if (layerEvents.size == 0 || layerEvents.has(mageEvent.name)) {
                const event = await eventRepo.findById(mageEvent.id)
                if (event != null) {
                    events.push(event)
                }
            }
        }

        return events
    }

    private layerName(events: MageEvent[]) {
        let layerName = ''
        for (let i = 0; i < events.length; i++) {
            if (i > 0) {
                layerName += ', '
            }
            layerName += events[i].name
        }
        return layerName
    }

}
