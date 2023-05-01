import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { AttributeConfig, AttributeConcatenationConfig, AttributeDefaultConfig } from '../ArcGISConfig';
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'

@Component({
  selector: 'arc-admin',
  templateUrl: './arc-admin.component.html',
  styleUrls: ['./arc-admin.component.scss']
})
export class ArcAdminComponent implements OnInit {

  config: ArcGISPluginConfig;

  infoTitle: string;
  infoMessage: string;
  editConfig: ArcGISPluginConfig;
  editFieldMappings: boolean;
  editAttributes: boolean;
  editType: string;
  editObject: any;
  editName: string;
  editValue: any;

  @ViewChild('infoDialog', { static: true })
  private infoTemplate: TemplateRef<unknown>
  @ViewChild('editProcessingDialog', { static: true })
  private editProcessingTemplate: TemplateRef<unknown>
  @ViewChild('editAttributesDialog', { static: true })
  private editAttributesTemplate: TemplateRef<unknown>
  @ViewChild('deleteFieldDialog', { static: true })
  private deleteFieldTemplate: TemplateRef<unknown>
  @ViewChild('addFieldDialog', { static: true })
  private addFieldTemplate: TemplateRef<unknown>
  @ViewChild('addFieldValueDialog', { static: true })
  private addFieldValueTemplate: TemplateRef<unknown>
  @ViewChild('editFieldDialog', { static: true })
  private editFieldTemplate: TemplateRef<unknown>
  @ViewChild('editBooleanFieldDialog', { static: true })
  private editBooleanFieldTemplate: TemplateRef<unknown>
  @ViewChild('editAttributeConfigDialog', { static: true })
  private editAttributeConfigTemplate: TemplateRef<unknown>

  constructor(private arcService: ArcService, private dialog: MatDialog) {
    this.config = defaultArcGISPluginConfig;
    this.editConfig = defaultArcGISPluginConfig;
    this.editFieldMappings = false;
    arcService.fetchArcConfig().subscribe(x => {
      this.config = x;
    })
  }

  ngOnInit(): void {
  }

  onDeleteLayer(layerUrl: string) {
    let index = 0;
    for (const featureServiceConfig of this.config.featureServices) {
      if (featureServiceConfig.url == layerUrl) {
        break;
      }
      index++;
    }
    if (index < this.config.featureServices.length) {
      this.config.featureServices.splice(index, 1);
    }
    this.arcService.putArcConfig(this.config);
  }

  onEditProcessing() {
    this.editConfig = this.copyConfig()
    this.dialog.open<unknown, unknown, string>(this.editProcessingTemplate)
  }

  onEditAttributes() {
    this.editConfig = this.copyConfig()
    this.dialog.open<unknown, unknown, string>(this.editAttributesTemplate)
  }

  setField(field: string, value: any) {
    if (value != undefined && value.length == 0) {
      value = undefined
    }
    (this.editConfig as any)[field] = value
    console.log('Editing field: ' + field + ', value: ' + value)
  }

  setNumberField(field: string, value: any, min: number) {
    if (value != undefined) {
      if (value.length == 0) {
        value = undefined
      } else {
        value = Number(value)
        if (value < min) {
          value = undefined
        }
      }
    }
    (this.editConfig as any)[field] = value
    console.log('Editing field: ' + field + ', value: ' + value)
  }

  copyConfig(): ArcGISPluginConfig {
    return JSON.parse(JSON.stringify(this.config))
  }

  saveEdit() {
    if (this.editConfig.enabled != undefined && this.editConfig.enabled != this.config.enabled) {
      this.config.enabled = this.editConfig.enabled
      console.log('Edited enabled: ' + this.config.enabled)
    }
    if (this.editConfig.intervalSeconds != undefined && this.editConfig.intervalSeconds != this.config.intervalSeconds) {
      this.config.intervalSeconds = this.editConfig.intervalSeconds
      console.log('Edited intervalSeconds: ' + this.config.intervalSeconds)
    }
    if (this.editConfig.startupIntervalSeconds != undefined && this.editConfig.startupIntervalSeconds != this.config.startupIntervalSeconds) {
      this.config.startupIntervalSeconds = this.editConfig.startupIntervalSeconds
      console.log('Edited startupIntervalSeconds: ' + this.config.startupIntervalSeconds)
    }
    if (this.editConfig.updateIntervalSeconds != undefined && this.editConfig.updateIntervalSeconds != this.config.updateIntervalSeconds) {
      this.config.updateIntervalSeconds = this.editConfig.updateIntervalSeconds
      console.log('Edited updateIntervalSeconds: ' + this.config.updateIntervalSeconds)
    }
    if (this.editConfig.batchSize != undefined && this.editConfig.batchSize != this.config.batchSize) {
      this.config.batchSize = this.editConfig.batchSize
      console.log('Edited batchSize: ' + this.config.batchSize)
    }
    if (this.editConfig.attachmentModifiedTolerance != undefined && this.editConfig.attachmentModifiedTolerance != this.config.attachmentModifiedTolerance) {
      this.config.attachmentModifiedTolerance = this.editConfig.attachmentModifiedTolerance
      console.log('Edited attachmentModifiedTolerance: ' + this.config.attachmentModifiedTolerance)
    }
    if (this.editConfig.observationIdField != undefined && this.editConfig.observationIdField != this.config.observationIdField) {
      this.config.observationIdField = this.editConfig.observationIdField
      console.log('Edited observationIdField: ' + this.config.observationIdField)
    }
    if (this.editConfig.idSeparator != undefined && this.editConfig.idSeparator != this.config.idSeparator) {
      this.config.idSeparator = this.editConfig.idSeparator
      console.log('Edited idSeparator: ' + this.config.idSeparator)
    }
    if (this.editConfig.eventIdField != this.config.eventIdField) {
      this.config.eventIdField = this.editConfig.eventIdField
      console.log('Edited eventIdField: ' + this.config.eventIdField)
    }
    if (this.editConfig.lastEditedDateField != this.config.lastEditedDateField) {
      this.config.lastEditedDateField = this.editConfig.lastEditedDateField
      console.log('Edited lastEditedDateField: ' + this.config.lastEditedDateField)
    }
    if (this.editConfig.eventNameField != this.config.eventNameField) {
      this.config.eventNameField = this.editConfig.eventNameField
      console.log('Edited eventNameField: ' + this.config.eventNameField)
    }
    if (this.editConfig.userIdField != this.config.userIdField) {
      this.config.userIdField = this.editConfig.userIdField
      console.log('Edited userIdField: ' + this.config.userIdField)
    }
    if (this.editConfig.usernameField != this.config.usernameField) {
      this.config.usernameField = this.editConfig.usernameField
      console.log('Edited usernameField: ' + this.config.usernameField)
    }
    if (this.editConfig.userDisplayNameField != this.config.userDisplayNameField) {
      this.config.userDisplayNameField = this.editConfig.userDisplayNameField
      console.log('Edited userDisplayNameField: ' + this.config.userDisplayNameField)
    }
    if (this.editConfig.deviceIdField != this.config.deviceIdField) {
      this.config.deviceIdField = this.editConfig.deviceIdField
      console.log('Edited deviceIdField: ' + this.config.deviceIdField)
    }
    if (this.editConfig.createdAtField != this.config.createdAtField) {
      this.config.createdAtField = this.editConfig.createdAtField
      console.log('Edited createdAtField: ' + this.config.createdAtField)
    }
    if (this.editConfig.lastModifiedField != this.config.lastModifiedField) {
      this.config.lastModifiedField = this.editConfig.lastModifiedField
      console.log('Edited lastModifiedField: ' + this.config.lastModifiedField)
    }
    if (this.editConfig.geometryType != this.config.geometryType) {
      this.config.geometryType = this.editConfig.geometryType
      console.log('Edited geometryType: ' + this.config.geometryType)
    }
    this.arcService.putArcConfig(this.config)
    console.log('Saved configuration edit')
  }

  cancelEdit() {
    console.log('Canceled configuration edit')
  }

  keys(value: any): string[] {
    let keys: string[]
    if (value != undefined) {
      keys = Object.keys(value)
    } else {
      keys = []
    }
    return keys
  }

  hasAttributeConfig(attribute: string): boolean {
    return this.attributeConfig(attribute) != undefined
  }

  getAttributeConfig(attribute: string): AttributeConfig {
    return this.attributeConfig(attribute)!
  }

  private attributeConfig(attribute: string): AttributeConfig | undefined {
    let attributeConfig = undefined
    if (this.config.attributes) {
      attributeConfig = this.config.attributes[attribute]
    }
    return attributeConfig
  }

  hasConcatenation(attribute: string): boolean {
    return this.concatenation(attribute) != undefined
  }

  getConcatenation(attribute: string): AttributeConcatenationConfig {
    return this.concatenation(attribute)!
  }

  private concatenation(attribute: string): AttributeConcatenationConfig | undefined {
    let concat = undefined
    const attributeConfig = this.attributeConfig(attribute)
    if (attributeConfig) {
      concat = attributeConfig.concatenation
    }
    return concat
  }

  hasMappings(attribute: string): boolean {
    return this.mappings(attribute) != undefined
  }

  getMappings(attribute: string): { [value: string]: any } {
    return this.mappings(attribute)!
  }

  private mappings(attribute: string): { [value: string]: any } | undefined {
    let mappings = undefined
    const attributeConfig = this.attributeConfig(attribute)
    if (attributeConfig) {
      mappings = attributeConfig.mappings
    }
    return mappings
  }

  hasDefaults(attribute: string): boolean {
    return this.defaults(attribute) != undefined
  }

  getDefaults(attribute: string): AttributeDefaultConfig[] {
    return this.defaults(attribute)!
  }

  private defaults(attribute: string): AttributeDefaultConfig[] | undefined {
    let defaults = undefined
    const attributeConfig = this.attributeConfig(attribute)
    if (attributeConfig) {
      defaults = attributeConfig.defaults
    }
    return defaults
  }

  hasOmit(attribute: string): boolean {
    return this.omit(attribute) != undefined
  }

  getOmit(attribute: string): boolean {
    return this.omit(attribute)!
  }

  private omit(attribute: string): boolean | undefined {
    let omit = undefined
    const attributeConfig = this.attributeConfig(attribute)
    if (attributeConfig) {
      omit = attributeConfig.omit
    }
    return omit
  }

  showInfo(title: string, message: string) {
    this.infoTitle = title
    this.infoMessage = message
    this.dialog.open<unknown, unknown, string>(this.infoTemplate)
  }

  showDeleteField(type: string, object: any, name: string, value: string) {
    this.editType = type;
    this.editObject = object;
    this.editName = name;
    this.editValue = value;
    this.dialog.open<unknown, unknown, string>(this.deleteFieldTemplate)
  }

  deleteField() {
    if (this.editObject != undefined) {
      if (this.editType == 'Default') {
        this.editObject.defaults.splice(this.editValue, 1)
      } else {
        delete this.editObject[this.editValue]
      }
      this.arcService.putArcConfig(this.config)
    }
  }

  showAddField(type: string, object: any) {
    this.editType = type;
    this.editObject = object;
    this.dialog.open<unknown, unknown, string>(this.addFieldTemplate)
  }

  addField(name: string) {
    if (this.editObject == undefined) {
      if (this.editType == 'Event') {
        this.config.fieldAttributes = {}
        this.editObject = this.config.fieldAttributes
      } else if (this.editType == 'Attribute') {
        this.config.attributes = {}
        this.editObject = this.config.attributes
      }
    }
    if (this.editType == 'Default') {
      if (this.editObject.defaults == undefined) {
        this.editObject.defaults = []
      }
      const attributeDefault = {} as AttributeDefaultConfig
      attributeDefault.value = name
      this.editObject.defaults.push(attributeDefault)
      this.arcService.putArcConfig(this.config)
    } else if (this.editObject[name] == undefined) {
      this.editObject[name] = {}
      this.arcService.putArcConfig(this.config)
    }
  }

  showAddFieldValue(type: string, object: any) {
    this.editType = type;
    this.editObject = object;
    this.dialog.open<unknown, unknown, string>(this.addFieldValueTemplate)
  }

  addFieldValue(name: string, value: any) {
    this.editObject[name] = value
    this.arcService.putArcConfig(this.config)
  }

  showEditField(name: string, field: string, object: any, value: any) {
    this.editName = name;
    this.editType = field;
    this.editObject = object;
    this.editValue = value;
    this.dialog.open<unknown, unknown, string>(this.editFieldTemplate)
  }

  editField(value: any) {
    this.editObject[this.editType] = value
    this.arcService.putArcConfig(this.config)
  }

  showEditBooleanField(name: string, field: string, object: any, value: any) {
    this.editName = name;
    this.editType = field;
    this.editObject = object;
    this.editValue = value;
    this.dialog.open<unknown, unknown, string>(this.editBooleanFieldTemplate)
  }

  showEditAttributeConfig(attribute: string) {
    this.editName = attribute
    this.dialog.open<unknown, unknown, string>(this.editAttributeConfigTemplate)
  }

  editAttributeConfig(concatenation: boolean, mappings: boolean, defaults: boolean, omit: boolean) {

    const attributeConfig = this.attributeConfig(this.editName)

    if (attributeConfig != undefined) {

      const hasConcatenation = this.hasConcatenation(this.editName)
      if (concatenation) {
        if (!hasConcatenation) {
          attributeConfig.concatenation = { delimiter: ', ', sameForms: true, differentForms: true }
        }
      } else if (hasConcatenation) {
        attributeConfig.concatenation = undefined
      }

      const hasMappings = this.hasMappings(this.editName)
      if (mappings) {
        if (!hasMappings) {
          attributeConfig.mappings = {}
        }
      } else if (hasMappings) {
        attributeConfig.mappings = undefined
      }

      const hasDefaults = this.hasDefaults(this.editName)
      if (defaults) {
        if (!hasDefaults) {
          attributeConfig.defaults = []
        }
      } else if (hasDefaults) {
        attributeConfig.defaults = undefined
      }

      const hasOmit = this.hasOmit(this.editName)
      if (omit) {
        if (!hasOmit) {
          attributeConfig.omit = true
        }
      } else if (hasOmit) {
        attributeConfig.omit = undefined
      }

      this.arcService.putArcConfig(this.config)
    }

  }

}
