
import Entity, {EntityOptions} from "../Engine/Entity"

/**
 * A floor object for the game world.
 */
export default class Floor extends Entity {

    static type = "Nanoshooter/Entities/Floor"

    private mesh: BABYLON.Mesh

    initialize() {
        const mesh = this.mesh = BABYLON.Mesh.CreateGround(this.tag, 6, 6, 2, this.stage.scene)
    }

    removal() {
        this.mesh.dispose()
    }
}