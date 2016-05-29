
import Entity, {EntityOptions} from "../Engine/Entity"

/**
 * A simple cube object in the game world.
 */
export default class Cube extends Entity {

    static type = "Nanoshooter/Entities/Cube"

    private mesh: BABYLON.Mesh

    initialize() {
        const mesh = this.mesh = BABYLON.Mesh.CreateBox(this.tag, 1, this.stage.scene)
        mesh.position.y = 1
    }

    removal() {
        this.mesh.dispose()
    }
}