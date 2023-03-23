import { ArcGISPluginConfig } from "./ArcGISPluginConfig"
import { FeatureServiceConfig, FeatureLayerConfig } from "./ArcGISConfig"
import { MageEvent, MageEventRepository } from '@ngageoint/mage.service/lib/entities/events/entities.events'
import { Layer, Field } from "./AddLayersRequest"
import { Form, FormField, FormFieldType, FormId } from '@ngageoint/mage.service/lib/entities/events/entities.events.forms'
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
     * @param featureLayer feature layer
     * @param nextId next service layer id
     * @param eventRepo event repository
     * @returns layer id
     */
    async createLayer(service: FeatureServiceConfig, featureLayer: FeatureLayerConfig, nextId: number, eventRepo: MageEventRepository): Promise<number | null> {

        const layer = { type: 'Feature Layer' } as Layer

        const layerIdentifier = featureLayer.layer
        const layerIdentifierNumber = Number(layerIdentifier)
        if (isNaN(layerIdentifierNumber)) {
            layer.name = String(layerIdentifier)
            layer.id = nextId
        } else {
            layer.id = layerIdentifierNumber
        }

        const events = await this.layerEvents(featureLayer, eventRepo)

        if (layer.name == null) {
            layer.name = this.layerName(events)
        }

        if (featureLayer.geometryType != null) {
            layer.geometryType = featureLayer.geometryType
        } else {
            layer.geometryType = 'esriGeometryPoint'
        }

        layer.fields = this.fields(events)

        // TODO Create the layer

        return layer.id
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
     * Builder the layer fields
     * @param events layer events
     * @returns fields
     */
    private fields(events: MageEvent[]): Field[] {

        const fields: Field[] = []

        fields.push(this.createTextField(this._config.observationIdField, false))
        if (this._config.eventIdField != null) {
            fields.push(this.createIntegerField(this._config.eventIdField, false))
        }
        if (this._config.eventNameField != null) {
            fields.push(this.createTextField(this._config.eventNameField, true))
        }
        if (this._config.userIdField != null) {
            fields.push(this.createTextField(this._config.userIdField, true))
        }
        if (this._config.usernameField != null) {
            fields.push(this.createTextField(this._config.usernameField, true))
        }
        if (this._config.userDisplayNameField != null) {
            fields.push(this.createTextField(this._config.userDisplayNameField, true))
        }
        if (this._config.deviceIdField != null) {
            fields.push(this.createTextField(this._config.deviceIdField, true))
        }
        if (this._config.createdAtField != null) {
            fields.push(this.createDateTimeField(this._config.createdAtField, true))
        }
        if (this._config.lastModifiedField != null) {
            fields.push(this.createDateTimeField(this._config.lastModifiedField, true))
        }
        if (this._config.geometryType != null) {
            fields.push(this.createTextField(this._config.geometryType, true))
        }

        const fieldNames = new Set<string>()
        for (const field of fields) {
            fieldNames.add(field.name)
        }

        this.eventsFields(events, fields, fieldNames)

        return fields
    }

    /**
     * Create a field
     * @param name field name
     * @param type form field type
     * @param nullable nullable flag
     * @param integer integer flag when numeric
     * @returns field
     */
    private createField(name: string, type: FormFieldType, nullable: boolean, integer?: boolean): Field {
        let field = this.initField(type, integer) as Field
        if (field != null) {
            field.name = ObservationsTransformer.replaceSpaces(name)
            field.alias = field.name
            field.nullable = nullable
            field.editable = true
        }
        return field
    }

    /**
     * Create a text field
     * @param name field name
     * @param nullable nullable flag
     * @returns field
     */
    private createTextField(name: string, nullable: boolean): Field {
        return this.createField(name, FormFieldType.Text, nullable)
    }

    /**
     * Create a numeric field
     * @param name field name
     * @param nullable nullable flag
     * @param integer integer flag
     * @returns field
     */
    private createNumericField(name: string, nullable: boolean, integer?: boolean): Field {
        return this.createField(name, FormFieldType.Numeric, nullable, integer)
    }

    /**
     * Create an integer field
     * @param name field name
     * @param nullable nullable flag
     * @returns field
     */
    private createIntegerField(name: string, nullable: boolean): Field {
        return this.createNumericField(name, nullable, true)
    }

    /**
     * Create a date time field
     * @param name field name
     * @param nullable nullable flag
     * @returns field
     */
    private createDateTimeField(name: string, nullable: boolean): Field {
        return this.createField(name, FormFieldType.DateTime, nullable)
    }

    /**
     * Build fields from the layer events
     * @param events layer events
     * @param fields created fields
     * @param fieldNames set of all field names
     */
    private eventsFields(events: MageEvent[], fields: Field[], fieldNames: Set<string>) {

        const forms = new Set<FormId>()

        for (const event of events) {
            this.eventFields(event, forms, fields, fieldNames)
        }

    }

    /**
     * Build fields from the layer event
     * @param event layer event
     * @param forms set of processed forms
     * @param fields created fields
     * @param fieldNames set of all field names
     */
    private eventFields(event: MageEvent, forms: Set<FormId>, fields: Field[], fieldNames: Set<string>) {

        for (const form of event.activeForms) {

            if (!forms.has(form.id)) {

                forms.add(form.id)

                for (const formField of form.fields) {
                    if (formField.archived == null || !formField.archived) {
                        this.createFormField(form, formField, fields, fieldNames)
                    }
                }

            }
        }

    }

    /**
     * Build a field from the form field
     * @param form form
     * @param formField form field
     * @param fields created fields
     * @param fieldNames set of all field names
     */
    private createFormField(form: Form, formField: FormField, fields: Field[], fieldNames: Set<string>) {

        const field = this.initField(formField.type)

        if (field != null) {

            let name = ObservationsTransformer.replaceSpaces(formField.title)

            if (fieldNames.has(name)) {
                name = form.name + '_' + name
            }
            fieldNames.add(name)

            field.name = name
            field.alias = field.name
            field.nullable = !formField.required
            field.editable = true
            field.defaultValue = formField.value

            fields.push(field)
        }

    }

    /**
     * Initialize a field by type
     * @param type form field type
     * @param integer numeric integer field type
     * @return field or null
     */
    private initField(type: FormFieldType, integer?: boolean): Field | null {

        let field = {} as Field

        switch (type) {
            case FormFieldType.CheckBox:
            case FormFieldType.Dropdown:
            case FormFieldType.Email:
            case FormFieldType.MultiSelectDropdown:
            case FormFieldType.Password:
            case FormFieldType.Radio:
            case FormFieldType.Text:
                field.type = 'esriFieldTypeString'
                field.actualType = 'nvarchar'
                field.sqlType = 'sqlTypeNVarchar'
                field.length = this._config.textFieldLength
                break;
            case FormFieldType.TextArea:
                field.type = 'esriFieldTypeString'
                field.actualType = 'nvarchar'
                field.sqlType = 'sqlTypeNVarchar'
                field.length = this._config.textAreaFieldLength
                break;
            case FormFieldType.DateTime:
                field.type = 'esriFieldTypeDate'
                field.sqlType = 'sqlTypeOther'
                field.length = 10
                break;
            case FormFieldType.Numeric:
                if (integer) {
                    field.type = 'esriFieldTypeInteger'
                    field.actualType = 'int'
                    field.sqlType = 'sqlTypeInteger'
                } else {
                    field.type = 'esriFieldTypeDouble'
                    field.actualType = 'float'
                    field.sqlType = 'sqlTypeFloat'
                }
                break;
            case FormFieldType.Geometry:
            case FormFieldType.Attachment:
            case FormFieldType.Hidden:
            default:
                break
        }

        return field.type != null ? field : null
    }

}
