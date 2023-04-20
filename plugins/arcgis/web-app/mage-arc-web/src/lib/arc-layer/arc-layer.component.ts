import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'
import { FeatureServiceConfig } from '../ArcGISConfig';
import { MatDialog } from '@angular/material/dialog'

@Component({
  selector: 'arc-layer',
  templateUrl: './arc-layer.component.html',
  styleUrls: ['./arc-layer.component.scss']
})
export class ArcLayerComponent implements OnInit {

  config: ArcGISPluginConfig;
  layers: string[];
  arcLayerControl = new FormControl('', [Validators.required])
  isLoading: boolean;
  private currentUrl: string;
  private timeoutId: number;

  @ViewChild('addLayerDialog', { static: true })
  private addLayerTemplate: TemplateRef<unknown>

  constructor(private arcService: ArcService, private dialog: MatDialog) {
    this.config = defaultArcGISPluginConfig;
    this.layers = new Array<string>();
    this.isLoading = false;
    arcService.fetchArcConfig().subscribe(x => {
      this.config = x;
    })
  }

  ngOnInit(): void {
    this.arcLayerControl.setValue('')
    this.layers = []
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

  onAddLayer() {
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
}