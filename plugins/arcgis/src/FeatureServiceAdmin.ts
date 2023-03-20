import { ArcGISPluginConfig } from "./ArcGISPluginConfig"
import { FeatureServiceConfig, FeatureLayerConfig } from "./ArcGISConfig"
import { MageEvent, MageEventRepository } from '@ngageoint/mage.service/lib/entities/events/entities.events'
import { Field } from "./AddLayersRequest"
import { FormField } from '@ngageoint/mage.service/lib/entities/events/entities.events.forms'
import { ObservationsTransformer } from "./ObservationsTransformer"

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

    /**
     * Create the layer
     * @param service feature service
     * @param layer feature layer
     * @param nextId next service layer id
     * @param eventRepo event repository
     * @returns layer id
     */
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

        const fields = this.eventsFields(events)

        // TODO Create the layer

        return layerId
    }

    /**
     * Get the layer events
     * @param layer feature layer
     * @param eventRepo event repository
     * @returns layer events
     */
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

    /**
     * Create a layer name
     * @param events layer events
     * @returns layer name
     */
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

    /**
     * Build fields from the layer events
     * @param events layer events
     * @returns fields
     */
    private eventsFields(events: MageEvent[]): Field[] {

        const fields: Field[] = []

        for (const event of events) {

            const eventFields = this.eventFields(event)

            for (const field of eventFields) {

                // TODO handle duplicate field name between forms and events

                fields.push(field)
            }

        }

        return fields
    }

    /**
     * Build fields from the layer event
     * @param event layer event
     * @returns fields
     */
    private eventFields(event: MageEvent): Field[] {

        const fields: Field[] = []

        for (const form of event.activeForms) {
            for (const field of form.fields) {
                fields.push(this.formField(field))
            }
        }

        return fields
    }

    /**
     * Build a field from the form field
     * @param formField
     * @returns field
     */
    private formField(formField: FormField): Field {

        const field = {} as Field

        field.name = ObservationsTransformer.replaceSpaces(formField.title)
        field.type = 'esriFieldTypeString' // TODO
        field.actualType = 'nvarchar' // TODO
        field.alias = field.name
        field.sqlType = 'sqlTypeNVarchar' // TODO
        field.length = 100 // TODO
        field.nullable = !formField.required
        field.editable = true
        field.defaultValue = formField.value

        return field
    }

}
