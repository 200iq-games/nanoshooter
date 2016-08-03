
import Entity, {EntityOptions, EntityState} from 'susa/src/Entity'

/**
 * A simple cube object in the game world.
 */
export default class Cube extends Entity {

  static type = 'Nanoshooter/Entities/Cube'

  private mesh: BABYLON.Mesh

  protected initialize(entityState: EntityState) {
    const mesh = this.mesh = BABYLON.Mesh.CreateBox(this.id, 1.5, this.stage.scene)
    mesh['cube'] = true

    const material = new BABYLON.StandardMaterial('floor', this.stage.scene)
    material.diffuseColor = new BABYLON.Color3(0, 1, 0.0)
    material.specularPower = 0
    mesh.material = material

    mesh.position.y = 21.13
    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
      mesh,
      BABYLON.PhysicsImpostor.BoxImpostor,
      {mass: 0.2, restitution: 0.1},
      this.stage.scene
    )
  }

  /**
   * Cleanup for removal from the game.
   */
  destructor() {
    this.mesh.dispose()
  }
}
