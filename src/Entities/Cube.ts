
import Entity, {EntityOptions, EntityState, EntityStateOptions} from "../Engine/Entity"

/**
 * A simple cube object in the game world.
 */
export default class Cube extends Entity {

    static type = "Nanoshooter/Entities/Cube"

    private mesh: BABYLON.Mesh

    protected initialize() {
        const mesh = this.mesh = BABYLON.Mesh.CreateBox(this.tag, 1, this.stage.scene)
        mesh.position.y = 2
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0.1, restitution: 0.1}, this.stage.scene)
    }

    removal() {
        this.mesh.dispose()
    }
}
