import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'
import { MatDialog } from '@angular/material/dialog'
import { ArcEventsModel } from './ArcEventsModel';
import { ArcEvent } from './ArcEvent';
import { ArcLayerSelectable } from '../arc-layer/ArcLayerSelectable';
import { EventsResult } from '../EventsResult';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'arc-event',
  templateUrl: './arc-event.component.html',
  styleUrls: ['./arc-event.component.scss']
})
export class ArcEventComponent implements OnInit {

  private eventsSubscription: Subscription;

  @Input('config') config: ArcGISPluginConfig;

  @Input() configChangedNotifier: Observable<void>;

  @Output() configChanged = new EventEmitter<ArcGISPluginConfig>();

  model: ArcEventsModel;
  isLoading: boolean;
  currentEditingEvent: ArcEvent;
  layers: ArcLayerSelectable[];

  @ViewChild('editEventDialog', { static: true })
  private editEventTemplate: TemplateRef<unknown>

  constructor(private arcService: ArcService, private dialog: MatDialog) {
    this.config = defaultArcGISPluginConfig;
    this.model = new ArcEventsModel();
    arcService.fetchEvents().subscribe(x => this.handleEventResults(x));
  }

  ngOnInit(): void {
    this.eventsSubscription = this.configChangedNotifier.subscribe(() => this.handleConfigChanged());
  }

  handleConfigChanged() {
    let eventResults = new Array<EventsResult>();
    if (this.model.events.length > 0) {
      for (const arcEvent of this.model.events) {
        const result = new EventsResult();
        result.name = arcEvent.name;
        eventResults.push(result);
      }

      this.model.events.splice(0, this.model.events.length);
      this.handleEventResults(eventResults);
    }
  }

  handleEventResults(x: EventsResult[]) {
    let activeEventMessage = 'Active events: ';
    for (const event of x) {
      activeEventMessage += event.name + ' ';
      let eventsLayers = this.eventLayers(event.name)
      const arcEvent = new ArcEvent(event.name, eventsLayers);
      this.model.events.push(arcEvent);
    }
    console.log(activeEventMessage);
  }

  private eventLayers(event: string): string[] {
    const eventsLayers = [];
    for (const featureServiceConfig of this.config.featureServices) {
      for (const arcLayer of featureServiceConfig.layers) {
        if (arcLayer.events == undefined
          || arcLayer.events == null
          || arcLayer.events.length == 0
          || arcLayer.events.indexOf(event) >= 0) {
          eventsLayers.push(String(arcLayer.layer));
        }
      }
    }
    return eventsLayers
  }

  onEditEvent(event: ArcEvent) {
    console.log('Editing event synchronization for event ' + event.name);
    this.currentEditingEvent = event;
    this.layers = [];

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
    for (const layer of this.layers) {
      for (const featureService of this.config.featureServices) {
        for (let layerIndex = 0; layerIndex < featureService.layers.length; layerIndex++) {
          const configLayer = featureService.layers[layerIndex]
          if (configLayer.layer == layer.name) {

            let events = null
            if (configLayer.events != undefined
              && configLayer.events != null
              && configLayer.events.length > 0) {
              events = configLayer.events
            }

            let indexOf = -1
            if (events != null) {
              indexOf = events.indexOf(this.currentEditingEvent.name);
            }

            if (layer.isSelected) {
              if (events != null && indexOf < 0) {
                events.push(this.currentEditingEvent.name);
              }
            } else {
              if (events == null) {
                configLayer.events = []
                for (const event of this.model.events) {
                  if (event.name != this.currentEditingEvent.name) {
                    configLayer.events.push(event.name)
                  }
                }
              } else if (indexOf >= 0) {
                events.splice(indexOf, 1);
                if (events.length == 0) {
                  featureService.layers.splice(layerIndex, 1)
                }
              }
            }

          }
        }
      }
      this.currentEditingEvent.layers = this.eventLayers(this.currentEditingEvent.name)
    }

    this.configChanged.emit(this.config);
    this.arcService.putArcConfig(this.config);
  }
}