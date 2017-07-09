
import BabylonEntity from 'Susa/BabylonEntity'
import Entity, {EntityOptions, EntityData} from 'Susa/Entity'

/**
 * A floor object for the game world.
 */
export default class Floor extends BabylonEntity {

  static type = 'Nanoshooter/Entities/Floor'

  /** Floor mesh. */
  private mesh: BABYLON.Mesh

  /**
   * Create a Floor.
   */
  constructor(options: EntityOptions) {
    super(options)
    const mesh = this.mesh = BABYLON.Mesh.CreateGround(this.id, 128, 128, 2, this.stage.scene)

    const material = new BABYLON.StandardMaterial('floor', this.stage.scene)
    material.specularColor = new BABYLON.Color3(0, 0, 0)
    material.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4)
    material.specularPower = 0
    mesh.material = material

    mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0, restitution: 0.1}, this.stage.scene)
  }

  /**
   * Cleanup for removal from the game.
   */
  destructor(): Promise<void> {
    this.mesh.dispose()
    return Promise.resolve()
  }
}
