import { ArcObject } from './ArcObject'
import { ObservationId } from '@ngageoint/mage.service/lib/entities/observations/entities.observations'

export interface ArcObservation {
    id: ObservationId,
    createdAt: number,
    lastModified: number,
    object: ArcObject,
    attachments: ArcAttachment[]
}

export interface ArcAttachment {
    field: string,
    lastModified: number,
    size: number,
    name: string,
    contentLocator: string
}
