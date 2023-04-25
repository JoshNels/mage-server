import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ArcGISPluginConfig, defaultArcGISPluginConfig } from '../ArcGISPluginConfig'
import { ArcService } from '../arc.service'
import { MatDialog } from '@angular/material/dialog'
import { ArcEventsModel } from './ArcEventsModel';
import { ArcEvent } from './ArcEvent';
import { ArcLayerSelectable } from '../arc-layer/ArcLayerSelectable';


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
    })
  }

  ngOnInit(): void {

  }

  onEditEvent(event: ArcEvent) {
    console.log('Editing event synchronization for event ' + event.name);
  }

  selectedChanged(layer: ArcLayerSelectable) {
    console.log('Selection changed for ' + layer.name);
  }

  isSaveDisabled() : boolean {
    return false;
  }

  saveChanges() {
    console.log('Saving changes to event sync');
  }
}