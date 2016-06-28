
import Entity, {EntityOptions, EntityState} from '../Framework/Entity'

/**
 * Spectator camera which the player may control.
 */
export default class Spectator extends Entity {

  static type = 'Nanoshooter/Entities/Spectator'

  /** Spectator camera. */
  camera: BABYLON.UniversalCamera

  /**
   * Create and configure the spectator cam.
   */
  protected initialize(entityState: EntityState) {

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
  destructor() {
    this.stage.scene.removeCamera(this.camera)
  }
}
