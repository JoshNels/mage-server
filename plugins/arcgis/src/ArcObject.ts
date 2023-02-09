// Define the structure of the converted arc objects.
export interface ArcObject {
    geometry: {
        x: number;
        y: number;
        spatialReference: {
            wkid: number;
        }
    },
    attributes: {
        [key: string]: any
    }
}