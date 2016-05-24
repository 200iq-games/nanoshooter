
import Entity, {EntityState, EntityOptions} from "../Engine/Entity";
import {TickInfo} from "../Engine/Ticker";

/**
 * A simple cube object in the game world.
 */
export default class Cube extends Entity {
    label = "Cube";

    state: CubeState = {
        health: 100
    }
}

/**
 * Structure of a cube's serializable state data.
 */
export interface CubeState extends EntityState {
    health: number;
}
