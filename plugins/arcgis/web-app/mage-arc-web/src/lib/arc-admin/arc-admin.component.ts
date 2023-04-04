import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'
import { MatDialog, } from '@angular/material/dialog'
import { FeatureServiceConfig } from '../ArcGISConfig';
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'
import { FeatureServiceResult } from '../FeatureServiceResult';

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

  arcLayerControl = new FormControl('', [Validators.required])
  @ViewChild('addLayerDialog', { static: true })
  private addLayerTemplate: TemplateRef<unknown>

  constructor(private arcService: ArcService, private dialog: MatDialog) {
    this.config = defaultArcGISPluginConfig;
    this.layers = new Array<string>();
    arcService.fetchArcConfig().subscribe(x => {
      this.config = x;
    })
  }

  ngOnInit(): void {
  }

  onAddLayer() {
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
    this.arcService.fetchArcLayers(currentUrl).subscribe(x => {
      console.log('arclayer response ' + x);
      for(const layer of x.layers) {
        this.layers.push(layer.name);
      }
    })
  }

  onAddLayerUrl(layerUrl: string, layers: string[]) {
    console.log('Adding layer ' + layerUrl)
    const featureLayer = {
      url: layerUrl,
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
}
