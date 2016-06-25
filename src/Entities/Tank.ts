
import Entity, {EntityOptions, EntityLogicInput, EntityLogicOutput, EntityState} from '../Engine/Entity'
import KeyboardWatcher from '../Toolbox/KeyboardWatcher'

/** Options for creating a tank. */
export interface TankOptions extends EntityOptions {
  entityState: TankState
}

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

  /** Camera for this tank. */
  protected camera: BABYLON.TargetCamera

  /**
   * Construct a tank.
   */
  constructor(options: TankOptions) {
    super(options)
    const {entityState} = options

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

      // When the tank is done loading.
      .then(() => {

        // Create the tank's camera – all tanks have a camera, it just might not be active.
        this.camera = new BABYLON.TargetCamera(`tank-camera-${this.id}`, BABYLON.Vector3.Zero(), this.stage.scene)
        this.camera.lockedTarget = this.chassis
        this.camera.position = this.chassis.position.add(new BABYLON.Vector3(0, 80, -40))

        // If the tank is player controlled.
        if (this.playerControlled) {

          // Create, position, and activate its camera.
          this.stage.scene.swithActiveCamera(this.camera)
        }
      })
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
        this.chassis.setAbsolutePosition(this.startingPosition.add(new BABYLON.Vector3(0, 10, 0)))

      // Apply physics.
      this.chassis.physicsImpostor = new BABYLON.PhysicsImpostor(
        this.chassis,
        BABYLON.PhysicsImpostor.BoxImpostor,
        {mass: 10, restitution: 0.1},
        this.stage.scene
      )
    })
  }

  /**
   * Run the tank's game logic.
   */
  logic(input: EntityLogicInput): EntityLogicOutput {

    // If meshes are loaded.
    if (this.meshes) {

      // Aim the tank's gun turret toward the user's cursor.
      if (this.stage.pick.hit) this.aimTurret(this.stage.pick.pickedPoint)

      // If the keyboard watcher is active.
      if (this.keyboardWatcher) {

        // Get the direction that the user wishes to move in.
        const desiredMovement = this.ascertainDesiredMovementVector()

        // Turn the tank chassis toward the desired movement vector.
        this.turnChassis(desiredMovement || this.lastDesiredMovementVector)

        // Gas the tank when movement keys are pressed.
        this.accelerateWhenMoving(desiredMovement)
      }
    }

    return
  }

  /** Remember our last movement direction so we face the same way when we stop. Intialized facing south. */
  protected lastDesiredMovementVector = new BABYLON.Vector3(0, 0, -1)

  /**
   * Get the direction in which the player wishes to move.
   */
  protected ascertainDesiredMovementVector(): (BABYLON.Vector3) {
    const vector = BABYLON.Vector3.Zero()
    const status = (label: string) => this.keyboardWatcher.status[label]

    if (!status('north') && !status('east') && !status('south') && !status('west'))
      return null

    if (status('north')) vector.z += 1
    if (status('east'))  vector.x += 1
    if (status('south')) vector.z -= 1
    if (status('west'))  vector.x -= 1

    this.lastDesiredMovementVector = vector
    return vector
  }

  protected speed = 5
  protected speedVector = new BABYLON.Vector3(this.speed, this.speed, this.speed)

  /**
   * Accelerate the tank when movement keys are pressed.
   */
  protected accelerateWhenMoving(desiredMovement: BABYLON.Vector3) {
    if (!desiredMovement) return
    this.chassis.physicsImpostor.setLinearVelocity(
      desiredMovement.multiply(this.speedVector)
    )
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
