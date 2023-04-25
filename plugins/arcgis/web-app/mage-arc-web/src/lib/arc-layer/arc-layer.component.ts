import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'
import { FeatureLayerConfig, FeatureServiceConfig } from '../ArcGISConfig';
import { MatDialog } from '@angular/material/dialog'
import { ArcLayerSelectable } from './ArcLayerSelectable';

@Component({
  selector: 'arc-layer',
  templateUrl: './arc-layer.component.html',
  styleUrls: ['./arc-layer.component.scss']
})
export class ArcLayerComponent implements OnInit {

  config: ArcGISPluginConfig;
  layers: ArcLayerSelectable[];
  arcLayerControl = new FormControl('', [Validators.required])
  isLoading: boolean;
  private currentUrl: string;
  private timeoutId: number;

  @ViewChild('addLayerDialog', { static: true })
  private addLayerTemplate: TemplateRef<unknown>

  constructor(private arcService: ArcService, private dialog: MatDialog) {
    this.config = defaultArcGISPluginConfig;
    this.layers = new Array<ArcLayerSelectable>();
    this.isLoading = false;
    arcService.fetchArcConfig().subscribe(x => {
      this.config = x;
    })
  }

  ngOnInit(): void {

  }

  onEditLayer(arcService: FeatureServiceConfig) {
    console.log('Editing layer ' + arcService.url)
    this.arcLayerControl.setValue(arcService.url)
    this.layers = []
    let selectedLayers = new Array<string>()
    for (const layer of arcService.layers) {
      selectedLayers.push(layer.layer)
    }
    this.fetchLayers(arcService.url, selectedLayers)
    this.dialog.open<unknown, unknown, string>(this.addLayerTemplate)
  }

  selectedChanged(arcLayer: ArcLayerSelectable) {
    arcLayer.isSelected = !arcLayer.isSelected
  }

  isSaveDisabled(): boolean {
    let isDisabled = true;

    for (const layer of this.layers) {
      if (layer.isSelected) {
        isDisabled = false;
        break;
      }
    }

    return isDisabled;
  }

  inputChanged(layerUrl: string) {
    console.log('Input changed ' + layerUrl);
    this.currentUrl = layerUrl;
    if (this.timeoutId !== undefined) {
      window.clearTimeout(this.timeoutId);
    }
    this.timeoutId = window.setTimeout(() => this.fetchLayers(this.currentUrl, []), 1000);
  }

  fetchLayers(currentUrl: string, selectedLayers: string[]) {
    console.log('Fetching layers for ' + currentUrl);
    this.isLoading = true;
    this.layers = []
    this.arcService.fetchArcLayers(currentUrl).subscribe(x => {
      console.log('arclayer response ' + x);
      if (x.layers !== undefined) {
        for (const layer of x.layers) {
          const selectableLayer = new ArcLayerSelectable(layer.name);
          if (selectedLayers.length > 0) {
            selectableLayer.isSelected = selectedLayers.indexOf(layer.name) >= 0;
          }
          this.layers.push(selectableLayer);
        }
      }
      this.isLoading = false;
    })
  }

  onAddLayer() {
    this.arcLayerControl.setValue('')
    this.layers = []
    this.dialog.open<unknown, unknown, string>(this.addLayerTemplate)
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

  onAddLayerUrl(layerUrl: string, layers: ArcLayerSelectable[]) {
    let serviceConfigToEdit = null;
    for (const service of this.config.featureServices) {
      if (service.url == layerUrl) {
        serviceConfigToEdit = service;
      }
    }

    if (serviceConfigToEdit == null) {
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
        if (aLayer.isSelected) {
          const layerConfig = {
            layer: aLayer.name
          }
          featureLayer.layers.push(layerConfig);
        }
      }
      this.config.featureServices.push(featureLayer);
    } else {
      console.log('Saving edited layer ' + layerUrl)
      serviceConfigToEdit.layers = new Array<FeatureLayerConfig>();
      for (const aLayer of layers) {
        if (aLayer.isSelected) {
          const layerConfig = {
            layer: aLayer.name
          }
          serviceConfigToEdit.layers.push(layerConfig);
        }
      }
    }

    this.arcService.putArcConfig(this.config);
  }
}