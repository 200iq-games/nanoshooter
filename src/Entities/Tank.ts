
import Entity, {EntityLogicInput, EntityLogicOutput, EntityState} from '../Engine/Entity'
import KeyboardWatcher from '../Engine/KeyboardWatcher'

/**
 * It's a full blown tank!
 */
export default class Tank extends Entity {
  static type = 'Nanoshooter/Entities/Tank'

  /** Default tank art asset. */
  protected artPath: string = 'art/tanks/alpha/tank-alpha.obj'

  /** Array of all meshes related to this tank. */
  protected meshes: BABYLON.Mesh[]

  /** Parent tank body. Other tank components are children of this core unit. */
  protected chassis: BABYLON.Mesh

  /** Top-mounted gun on a swivel. */
  protected turret: BABYLON.Mesh

  /** Monitor keyboard activity for tank controls. */
  protected keyboardWatcher: KeyboardWatcher

  /** Whether or not this tank will respond to keyboard input and the like. */
  protected playerControlled = false

  /** Position the tank will start at. */
  protected startingPosition: BABYLON.Vector3

  /**
   * Initialize the tank, by loading it.
   */
  initialize(entityState: TankState) {

    // Starting position.
    if (entityState.position) {
      const p = entityState.position
      this.startingPosition = new BABYLON.Vector3(p[0], p[1], p[2])
    }

    // Determine player controlled state.
    this.playerControlled = !!entityState.playerControlled

    // If this tank is player controlled, establish a keyboard watcher.
    if (this.playerControlled) {
      this.keyboardWatcher = new KeyboardWatcher({
        keyNames: {
          'north': 'w',
          'east': 'd',
          'south': 's',
          'west': 'a',
        }
      })
    }

    // Load the tank obj from the art path specified in entity state, or use the default.
    this.loadTank(entityState.artPath || this.artPath)
  }

  /**
   * Cleanup this tank entity.
   */
  removal() {

    // Remove all meshes from the scene.
    for (const mesh of this.meshes) {
      this.stage.scene.removeMesh(mesh)
    }

    // Cleanup the keyboard watcher.
    this.keyboardWatcher.unbind()
  }

  /**
   * Load tank art into the scene.
   */
  loadTank(path: string): Promise<void> {
    return this.loader.loadObject({path}).then(loaded => {
      this.meshes = loaded.meshes

      this.chassis = this.meshes.find(mesh => /Chassis/i.test(mesh.name))
      this.turret = this.meshes.find(mesh => /Turret/i.test(mesh.name))

      this.turret.parent = this.chassis;

      if (this.startingPosition)
        this.chassis.setAbsolutePosition(this.startingPosition)
    })
  }

  /**
   * Run the tank's game logic.
   */
  logic(input: EntityLogicInput): EntityLogicOutput {

    // Stuff that we only do when the meshes are loaded, and the keyboard watcher is active.
    if (this.meshes && this.keyboardWatcher) {

      // Aim the tank chassis toward the desired movement vector.
      this.turnChassis(this.ascertainDesiredMovementVector())

      // Aim the tank's gun turret toward the user's cursor.
      if (this.stage.pick.hit) this.aimTurret(this.stage.pick.pickedPoint)
    }

    return
  }

  /** Remember our last movement direction so we face the same way when we stop. Intialized facing south. */
  protected lastDesiredMovementVector = new BABYLON.Vector3(0, 0, -1)

  /**
   * Get the direction in which the player wishes to move.
   */
  protected ascertainDesiredMovementVector() {
    const vector = BABYLON.Vector3.Zero()
    const status = (label: string) => this.keyboardWatcher.status[label]

    if (!status('north') && !status('east') && !status('south') && !status('west'))
      return this.lastDesiredMovementVector

    if (status('north')) vector.z += 1
    if (status('east'))  vector.x += 1
    if (status('south')) vector.z -= 1
    if (status('west'))  vector.x -= 1

    return this.lastDesiredMovementVector = vector
  }

  /**
   * Orient the chassis in a given direction.
   */
  protected turnChassis(direction: BABYLON.Vector3) {
    const point = this.chassis.position.add(direction)
    this.chassis.lookAt(point, 0, 0, 0)
  }

  /**
   * Aim the turret toward any point in the 3D world.
   */
  protected aimTurret(pick: BABYLON.Vector3) {
    const aimPoint = BABYLON.Vector3.Zero()
    aimPoint.copyFrom(pick)
    aimPoint.y = this.turret.position.y

    const matrix = BABYLON.Matrix.Zero()
    this.chassis.getWorldMatrix().invertToRef(matrix)
    const localPoint = BABYLON.Vector3.TransformCoordinates(aimPoint, matrix)

    this.turret.lookAt(localPoint, 0, 0, 0)
  }
}

/**
 * State data for a Tank!
 */
export interface TankState extends EntityState {
  playerControlled?: boolean
  artPath?: string
  position?: number[]
}
