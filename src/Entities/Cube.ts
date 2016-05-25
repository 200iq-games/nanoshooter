
import Entity, {EntityOptions, EntityState} from "../Engine/Entity"
import {TickInfo} from "../Engine/Ticker"

/**
 * A simple cube object in the game world.
 */
export default class Cube extends Entity {

    static type = "Nanoshooter/Entities/Cube"

    label = "Cube"

    health: number = 100

    logic(entityState: EntityState, tickInfo: TickInfo) {}
}


/**
 * Structure of a cube's serializable state data.
 */
export interface CubeState extends EntityState {

    health: number
}
