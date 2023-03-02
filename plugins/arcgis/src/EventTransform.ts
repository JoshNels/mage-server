import { ArcGISPluginConfig } from "./ArcGISPluginConfig"
import { MageEvent } from '@ngageoint/mage.service/lib/entities/events/entities.events'
import { Form } from '@ngageoint/mage.service/lib/entities/events/entities.events.forms'

/**
 * Contains information used to transform observations from a single event.
 */
export class EventTransform {

    /**
     * The MAGE event.
     */
    mageEvent: MageEvent | null

    /**
     * Form field mappings between form ids and form fields.
     */
    formFields: Map<number, FormFields> = new Map()

    /**
     * Constructor.
     * @param config The plugins configuration.
     * @param mageEvent The MAGE Event.
     */
    constructor(config: ArcGISPluginConfig, mageEvent: MageEvent | null) {
        this.mageEvent = mageEvent
        this.initialize(config)
    }

    /**
     * Initialize the event fields.
     * @param config The plugins configuration.
     */
    private initialize(config: ArcGISPluginConfig) {

        const allFields = new Set<string>()

        allFields.add(config.observationIdField)
        if (config.observationIdField != config.eventIdField) {
            allFields.add(config.eventIdField)
        }
        allFields.add(config.eventNameField)
        allFields.add(config.userIdField)
        allFields.add(config.usernameField)
        allFields.add(config.userDisplayNameField)
        allFields.add(config.deviceIdField)
        allFields.add(config.createdAtField)
        allFields.add(config.lastModifiedField)

        if (this.mageEvent != null) {

            const formAttributes = config.fieldAttributes != null ? config.fieldAttributes[this.mageEvent.name] : null

            // Initialize active form active fields
            for (const form of this.mageEvent.activeForms) {
                this.initializeFields(form, allFields, formAttributes)
            }

            // Initialize active form archived fields
            this.initializeArchivedFields(allFields, formAttributes)

            // Initialize archived form fields
            for (const form of this.mageEvent.archivedForms) {
                this.initializeFields(form, allFields, formAttributes)
            }

        }

    }

    /**
     * Initialize the form fields.
     * @param form The form.
     * @param allFields Used to build and track all event fields.
     * @param formAttributes Form attributes override mappings
     */
    private initializeFields(form: Form, allFields: Set<string>, formAttributes: any) {

        const fields = new FormFields(form)

        const fieldAttributes = formAttributes != null ? formAttributes[fields.name] : null

        for (const field of form.fields) {

            let attribute = field.title
            if (form.archived || !field.archived) {
                attribute = this.initializeField(attribute, fields.name, allFields, fieldAttributes)
            }

            fields.set(field.title, attribute, field.archived)
        }

        this.formFields.set(form.id, fields)
    }

    /**
     * Initialize the archived form fields.
     * @param allFields Used to build and track all event fields.
     * @param formAttributes Form attributes override mappings
     */
    private initializeArchivedFields(allFields: Set<string>, formAttributes: any) {

            for (const fields of this.formFields.values()) {

                const fieldAttributes = formAttributes != null ? formAttributes[fields.name] : null

                for (const field of fields.archivedFields) {
                    const attribute = this.initializeField(field, fields.name, allFields, fieldAttributes)
                    fields.set(field, attribute)
                }

            }

    }

    /**
     * Initialize the form field.
     * @param field The field.
     * @param formName The form name.
     * @param allFields Used to build and track all event fields.
     * @param fieldAttributes Field attributes override mappings
     * @return attribute name
     */
    private initializeField(field: string, formName: string, allFields: Set<string>, fieldAttributes: any): string {

        let attribute = null

        if (fieldAttributes != null) {
            attribute = fieldAttributes[field]
        }

        if (attribute == null) {

            attribute = field

            if (allFields.has(attribute)) {
                attribute = formName + '_' + attribute
            }

        }

        allFields.add(attribute)

        return attribute
    }

    /**
     * Get the form fields for the form id.
     * @param id The form id.
     * @return The form fields.
     */
    get(id: number): FormFields | undefined {
        return this.formFields.get(id)
    }

}

/**
 * Mapping between form field titles and arc attributes.
 */
export class FormFields {

    /**
     * Form name
     */
    name: string

    /**
     * Form archived flag
     */
    archived: boolean

    /**
     * Form field mapping between titles and arc atrribute fields.
     */
    fields: Map<string, string> = new Map()

    /**
     * Archived form fields
     */
    archivedFields: Set<string> = new Set()

    /**
     * Constructor
     * @param form The form.
     */
    constructor(form: Form) {
        this.name = form.name
        this.archived = form.archived
    }

    /**
     * Set the form field title to an arc attribute.
     * @param title The form field title.
     * @param attribute The arc attribute.
     * @param archived Archived field flag.
     */
    set(title: string, attribute: string, archived?: boolean) {
        this.fields.set(title, attribute)
        if (archived) {
            this.archivedFields.add(title)
        }
    }

    /**
     * Get the arc attribute for the form field title.
     * @param title The form field title.
     * @return The arc attribute.
     */
    get(title: string): string | undefined {
        return this.fields.get(title)
    }

    /**
     * Is the form field archived.
     * @param title The form field title.
     * @return True if archived.
     */
    isArchived(title: string): boolean {
        return this.fields.has(title)
    }

}
