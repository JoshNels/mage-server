// Define the structure of the converted arc objects.

export interface ArcObject {
    geometry: ArcGeometry,
    attributes: {
        [key: string]: any
    }
}

export interface ArcGeometry {
    spatialReference: {
        wkid: number
    }
}

export interface ArcPoint extends ArcGeometry {
    x: number
    y: number
}
