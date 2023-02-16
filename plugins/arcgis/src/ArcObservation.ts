import { ArcObject } from './ArcObject'
import { ObservationId } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'

export interface ArcObservation {
    id: ObservationId,
    object: ArcObject,
    attachments: ArcAttachment[]
}

export interface ArcAttachment {
    field: string,
    contentLocator: string
}
