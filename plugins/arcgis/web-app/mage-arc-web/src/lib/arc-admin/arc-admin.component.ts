import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { FeatureServiceConfig, AttributeConfig, AttributeConcatenationConfig, AttributeDefaultConfig } from '../ArcGISConfig';
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'

@Component({
  selector: 'arc-admin',
  templateUrl: './arc-admin.component.html',
  styleUrls: ['./arc-admin.component.scss']
})
export class ArcAdminComponent implements OnInit {

  config: ArcGISPluginConfig;
  private currentUrl: string;
  private timeoutId: number;
  layers: string[];
  infoTitle: string;
  infoMessage: string;
  isLoading: boolean;
  editConfig: ArcGISPluginConfig;

  arcLayerControl = new FormControl('', [Validators.required])
  @ViewChild('addLayerDialog', { static: true })
  private addLayerTemplate: TemplateRef<unknown>
  @ViewChild('infoDialog', { static: true })
  private infoTemplate: TemplateRef<unknown>
  @ViewChild('editProcessingDialog', { static: true })
  private editProcessingTemplate: TemplateRef<unknown>
  @ViewChild('editAttributesDialog', { static: true })
  private editAttributesTemplate: TemplateRef<unknown>

  constructor(private arcService: ArcService, private dialog: MatDialog) {
    this.config = defaultArcGISPluginConfig;
    this.editConfig = defaultArcGISPluginConfig;
    this.layers = new Array<string>();
    this.isLoading = false;
    arcService.fetchArcConfig().subscribe(x => {
      this.config = x;
    })
  }

  ngOnInit(): void {
  }

  onAddLayer() {
    this.arcLayerControl.setValue('')
    this.layers = []
    this.dialog.open<unknown, unknown, string>(this.addLayerTemplate)
  }

  inputChanged(layerUrl: string) {
    console.log('Input changed ' + layerUrl);
    this.currentUrl = layerUrl;
    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.fetchLayers(this.currentUrl), 1000);
  }

  fetchLayers(currentUrl: string) {
    console.log('Fetching layers for ' + currentUrl);
    this.isLoading = true;
    this.layers = []
    this.arcService.fetchArcLayers(currentUrl).subscribe(x => {
      console.log('arclayer response ' + x);
      if (x.layers !== undefined) {
        for (const layer of x.layers) {
          this.layers.push(layer.name);
        }
      }
      this.isLoading = false;
    })
  }

  onAddLayerUrl(layerUrl: string, layers: string[]) {
    console.log('Adding layer ' + layerUrl)
    const splitUrl = layerUrl.split('?');
    const justUrl = splitUrl[0];
    const params = splitUrl[1];
    const urlParams = new URLSearchParams(params);
    const token = urlParams.get('token');
    console.log('token is ' + token);
    const featureLayer = {
      url: justUrl,
      token: token,
      layers: []
    } as FeatureServiceConfig;
    for (const aLayer of layers) {
      const layerConfig = {
        layer: aLayer
      }
      featureLayer.layers.push(layerConfig);
    }
    this.config.featureServices.push(featureLayer);
    this.arcService.putArcConfig(this.config);
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

  attributeConfig(attribute: string): AttributeConfig | undefined {
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

}
