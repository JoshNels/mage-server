import { ArcEventLayer } from "./ArcEventLayer";

export class ArcEvent {
    name: string;
    layers: ArcEventLayer[];

    constructor(name: string, layers: ArcEventLayer[]) {
        this.name = name;
        this.layers = layers;
    }
}