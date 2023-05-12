import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'
import { MatDialog } from '@angular/material/dialog'
import { ArcEventsModel } from './ArcEventsModel';
import { ArcEvent } from './ArcEvent';
import { ArcLayerSelectable } from '../arc-layer/ArcLayerSelectable';
import { Observable, Subscription } from 'rxjs';
import { EventResult } from '../EventsResult';


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
    let eventResults = new Array<EventResult>();
    if (this.model.events.length > 0) {
      for (const arcEvent of this.model.events) {
        const result = new EventResult();
        result.name = arcEvent.name;
        eventResults.push(result);
      }

      this.model.events.splice(0, this.model.events.length);
      this.handleEventResults(eventResults);
    }
  }

  handleEventResults(x: EventResult[]) {
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
        if (arcLayer.events == null
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
        for (const configLayer of featureService.layers) {
          if (configLayer.layer == layer.name) {

            if (layer.isSelected) {
              // Only add the event if layer events are specified and do not contain the event
              if (configLayer.events != null
                && configLayer.events.indexOf(this.currentEditingEvent.name) == -1) {
                configLayer.events.push(this.currentEditingEvent.name);
              }
            } else if (configLayer.events != null) {
              const indexOf = configLayer.events.indexOf(this.currentEditingEvent.name);
              if (indexOf >= 0) {
                configLayer.events.splice(indexOf, 1);
              }
            } else {
              // Specify all other events to remove the event from the layer
              configLayer.events = []
              for (const event of this.model.events) {
                if (event.name != this.currentEditingEvent.name) {
                  configLayer.events.push(event.name)
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