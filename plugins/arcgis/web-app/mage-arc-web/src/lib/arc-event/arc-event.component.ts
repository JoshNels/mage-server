import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'
import { MatDialog } from '@angular/material/dialog'
import { ArcEventsModel } from './ArcEventsModel';
import { ArcEvent } from './ArcEvent';
import { ArcLayerSelectable } from '../arc-layer/ArcLayerSelectable';
import { EventsResult } from '../EventsResult';


@Component({
  selector: 'arc-event',
  templateUrl: './arc-event.component.html',
  styleUrls: ['./arc-event.component.scss']
})
export class ArcEventComponent implements OnInit {

  config: ArcGISPluginConfig;
  model: ArcEventsModel;
  isLoading: boolean;
  currentEditingEvent: ArcEvent;
  layers: ArcLayerSelectable[];

  @ViewChild('editEventDialog', { static: true })
  private editEventTemplate: TemplateRef<unknown>

  constructor(private arcService: ArcService, private dialog: MatDialog) {
    this.config = defaultArcGISPluginConfig;
    this.model = new ArcEventsModel();
    arcService.fetchArcConfig().subscribe(x => {
      this.config = x;
      arcService.fetchEvents().subscribe(x => this.handleEventResults(x));
    });
  }

  ngOnInit(): void {

  }

  handleEventResults(x: EventsResult[]) {
    let activeEventMessage = 'Active events: ';
    for (const event of x) {
      activeEventMessage += event.name + ' ';
      let eventsLayers = new Array<string>();
      for (const featureServiceConfig of this.config.featureServices) {
        for (const arcLayer of featureServiceConfig.layers) {
          if (arcLayer.events == undefined
            || arcLayer.events == null
            || arcLayer.events.length == 0
            || arcLayer.events.indexOf(event.name) >= 0) {
            eventsLayers.push(String(arcLayer.layer));
          }
        }
      }
      const arcEvent = new ArcEvent(event.name, eventsLayers);
      this.model.events.push(arcEvent);
    }
    console.log(activeEventMessage);
  }

  onEditEvent(event: ArcEvent) {
    console.log('Editing event synchronization for event ' + event.name);
    this.currentEditingEvent = event;
    this.layers = new Array<ArcLayerSelectable>();

    for (const serviceConfig of this.config.featureServices) {
      for (const layerConfig of serviceConfig.layers) {
        const configLayerName = String(layerConfig.layer);
        const selectableLayer = new ArcLayerSelectable(configLayerName);
        selectableLayer.isSelected = event.layers.indexOf(configLayerName) >= 0;
        this.layers.push(selectableLayer);
      }
    }

    this.dialog.open<unknown, unknown, string>(this.editEventTemplate)
  }

  selectedChanged(layer: ArcLayerSelectable) {
    console.log('Selection changed for ' + layer.name);
    layer.isSelected = !layer.isSelected;
  }

  saveChanges() {
    console.log('Saving changes to event sync');
    for(const layer of this.layers) {
      for(const featureService of this.config.featureServices) {
        for(const configLayer of featureService.layers) {
          if(configLayer.layer == layer.name) {
            if(configLayer.events == undefined || configLayer.events == null) {
              configLayer.events = new Array<string>();
            }
            const indexOf = configLayer.events.indexOf(this.currentEditingEvent.name);
            if(layer.isSelected && indexOf < 0) {
              configLayer.events.push(this.currentEditingEvent.name);
            } else if(!layer.isSelected && indexOf >= 0) {
              configLayer.events.splice(indexOf);
            }
          }
        }
      }
    }
    
    this.arcService.putArcConfig(this.config);
  }
}