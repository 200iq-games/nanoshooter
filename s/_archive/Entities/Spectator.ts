
import BabylonEntity from 'Susa/BabylonEntity'
import Entity, {EntityOptions, EntityData} from 'Susa/Entity'

/**
 * Spectator camera which the player may control.
 */
export default class Spectator extends BabylonEntity {

  static type = 'Nanoshooter/Entities/Spectator'

  /** Spectator camera. */
  camera: BABYLON.UniversalCamera

  /**
   * Create and configure the spectator cam.
   */
  constructor(options: EntityOptions) {
    super(options)

    // Create the camera.
    this.camera = new BABYLON.UniversalCamera(
      'spectator' + (+new Date),
      new BABYLON.Vector3(0, 10, 0),
      this.stage.scene
    )

    // Attach the canvas as a source of input.
    this.camera.attachControl(this.stage.canvas)

    // Make the camera the active one.
    this.stage.scene.activeCamera = this.camera
  }

  /**
   * Cleanup for removal from the game.
   */
  destructor(): Promise<void> {
    this.stage.scene.removeCamera(this.camera)
    return Promise.resolve()
  }
}
