import { ArcGISPluginConfig } from "./ArcGISPluginConfig"
import { MageEvent } from '@ngageoint/mage.service/lib/entities/events/entities.events'

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
     * Initialize the form fields.
     * @param config The plugins configuration.
     */
    private initialize(config: ArcGISPluginConfig) {

        const allFields = new Set<string>()

        allFields.add(config.observationIdField)
        allFields.add(config.eventNameField)
        allFields.add(config.userIdField)
        allFields.add(config.usernameField)
        allFields.add(config.userDisplayNameField)
        allFields.add(config.deviceIdField)
        allFields.add(config.createdAtField)
        allFields.add(config.lastModifiedField)

        if (this.mageEvent != null) {

            const formAttributes = config.fieldAttributes[this.mageEvent.name]

            for (const form of this.mageEvent.activeForms) {

                const formName = form.name

                let fieldAttributes = null
                if (formAttributes != null) {
                    fieldAttributes = formAttributes[formName]
                }

                const fields = new FormFields()
                
                for (const field of form.fields) {

                    const archived = field.archived
                    if (archived == null || !archived) {

                        let title = null

                        if (fieldAttributes != null) {
                            title = fieldAttributes[field.title]
                        }

                        if (title == null) {

                            title = field.title

                            if (allFields.has(title)) {
                                title = formName + '_' + title
                            }

                        }

                        allFields.add(title)
                        fields.set(field.title, title)
                    }

                }

                this.formFields.set(form.id, fields)
            }
        }

    }

    /**
     * Get the form fields for the form id.
     * @param id The form id.
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
     * Form field mapping between titles and arc atrribute fields.
     */
    fields: Map<string, string> = new Map()

    /**
     * Set the form field title to an arc attribute.
     * @param title The form field title.
     * @param attribute The arc attribute.
     */
    set(title: string, attribute: string) {
        this.fields.set(title, attribute)
    }

    /**
     * Get the arc attribute for the form field title.
     * @param title The form field title.
     */
    get(title: string): string | undefined {
        return this.fields.get(title)
    }

}
