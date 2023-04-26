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
  layers: ArcLayerSelectable[];

  @ViewChild('syncLayerDialog', { static: true })
  private syncLayerTemplate: TemplateRef<unknown>

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
  }

  selectedChanged(layer: ArcLayerSelectable) {
    console.log('Selection changed for ' + layer.name);
  }

  isSaveDisabled(): boolean {
    return false;
  }

  saveChanges() {
    console.log('Saving changes to event sync');
  }
}