
import Entity, {EntityOptions} from "../Engine/Entity"

/**
 * A floor object for the game world.
 */
export default class Floor extends Entity {

    static type = "Nanoshooter/Entities/Floor"

    private mesh: BABYLON.Mesh

    initialize() {
        const mesh = this.mesh = BABYLON.Mesh.CreateGround(this.tag, 6, 6, 2, this.game.scene)
        mesh.position.y = -2
        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.1}, this.game.scene)
    }

    removal() {
        this.mesh.dispose()
    }
}