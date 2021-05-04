import { Component, Input } from '@angular/core';

/**
 * TODO: move to forms model module (which doesn't exist yet)
 */
interface RadioField {
  title: string,
  name: string,
  value: string,
  required: boolean,
  choices: { title: string }[]
}

@Component({
  selector: 'observation-edit-radio',
  templateUrl: './observation-edit-radio.component.html',
  styleUrls: ['./observation-edit-radio.component.scss']
})
export class ObservationEditRadioComponent {
  @Input() field: RadioField
}
