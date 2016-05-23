
import Entity, {EntityState} from "../Engine/Entity";

export default class Cube extends Entity {
    state: CubeState = {
        health: 100
    }
}

export interface CubeState extends EntityState {
    health: number;
}
