export class ArcEvent {
    name: string;
    layers: string[];

    constructor(name: string, layers: string[]) {
        this.name = name;
        this.layers = layers;
    }
}