// Define the structure of the converted arc objects.

export interface ArcObject {
    geometry: ArcGeometry,
    attributes: {
        [key: string]: any
    }
}

export class ArcGeometry {
    spatialReference: {
        wkid: number
    };
    esriGeometryType: string;

    constructor() {
        this.spatialReference = {
            wkid: 4326
        };
        this.esriGeometryType = 'esriGeometryPoint';
    }
}

export class ArcPoint extends ArcGeometry {
    x: number;
    y: number;

    constructor() {
        super();
        this.x = 0;
        this.y = 0;
    }
}

export class ArcPolyline extends ArcGeometry {
    paths: number[][][];

    constructor() {
        super();
        this.paths = [];
        super.esriGeometryType = 'esriGeometryPolyline'
    }
}

export class ArcPolygon extends ArcGeometry {
    rings: number[][][];

    constructor() {
        super();
        this.rings = [];
        super.esriGeometryType = 'esriGeometryPolygon';
    }
}
