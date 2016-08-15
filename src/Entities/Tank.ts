
import {Tick} from 'Susa/Ticker'
import Watcher, { Input } from 'Susa/Watcher'
import BabylonEntity from 'Susa/BabylonEntity'
import Entity, {EntityOptions, EntityLogicInput, EntityData} from 'Susa/Entity'

/**
 * Options for creating a tank.
 */
export interface TankOptions extends EntityOptions {
  entityState: TankState
}

/**
 * It's a full blown tank!
 */
export default class Tank extends BabylonEntity {
  static type = 'Nanoshooter/Entities/Tank'

  public static get TURN_RIGHT(): number { return 1 }
  public static get TURN_LEFT(): number { return -1 }
  public static get MOVE_FORWARD(): number { return 1 }
  public static get MOVE_BACKWARD(): number { return -1 }

  /** Default tank art asset. */
  protected artPath: string = 'art/tanks/alpha/tank-alpha.obj'

  /** Array of all meshes related to this tank. */
  protected meshes: BABYLON.Mesh[]

  /** Parent tank body. Other tank components are children of this core unit. */
  protected chassis: BABYLON.Mesh

  /** Top-mounted gun on a swivel. */
  protected turret: BABYLON.Mesh

  /** Monitor user input activity for tank controls. */
  protected watcher: Watcher

  /** Whether or not this tank will respond to user input. */
  protected playerControlled = false

  /** Position the tank will start at. */
  protected startingPosition: BABYLON.Vector3

  /** Camera for this tank. */
  protected camera: BABYLON.TargetCamera

  /** Movement attributes */
  protected speedMax = 5
  protected speedTurn = 3
  protected chassisFacing = 0
  protected turnSpeed = Math.PI / 180

  /**
   * Construct a tank.
   */
  constructor(options: TankOptions) {
    super(options)
    const {entityState: tankState} = options

    // Starting position.
    if (tankState.position) {
      const p = tankState.position
      this.startingPosition = new BABYLON.Vector3(p[0], p[1], p[2])
    }

    // Determine player controlled state.
    this.playerControlled = !!tankState.playerControlled

    // If this tank is player controlled, establish a keyboard watcher.
    if (this.playerControlled) {
      this.watcher = new Watcher({
        bindings: {
          accel: Input.W,
          right: Input.D,
          brake: Input.S,
          left: Input.A,
        }
      })
    }

    // Load the tank obj from the art path specified in entity state, or use the default.
    this.loadTank(tankState.artPath || this.artPath)

      // When the tank is done loading.
      .then(() => {

        // Create the tank's camera – all tanks have a camera, it just might not be active.
        this.camera = new BABYLON.TargetCamera(`tank-camera-${this.id}`, BABYLON.Vector3.Zero(), this.stage.scene)
        this.camera.lockedTarget = this.chassis
        this.camera.position = this.chassis.position.add(new BABYLON.Vector3(0, 80, -40))

        // // If the tank is player controlled.
        // if (this.playerControlled) {

        //   // Create, position, and activate its camera.
        //   this.stage.scene.swithActiveCamera(this.camera)
        // }
      })
  }

  /**
   * Load tank art (.obj file) into the scene.
   */
  loadTank(path: string): Promise<void> {
    return this.stage.loader.loadAsset({path}).then(loaded => {
      this.meshes = loaded.meshes

      // Find the right meshes.
      this.chassis = this.meshes.find(mesh => /Chassis/i.test(mesh.name))
      this.turret = this.meshes.find(mesh => /Turret/i.test(mesh.name))

      // Attach the turret to the chassis.
      this.turret.parent = this.chassis

      // Assume the starting position.
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
  logic(tick: Tick) {

    // If meshes are loaded.
    if (this.meshes) {

      // Aim the tank's gun turret toward the user's cursor.
      if (this.stage.pick.hit) this.aimTurret(this.stage.pick.pickedPoint)

      // If the keyboard watcher is active.
      if (this.watcher) {
        this.handleKeyboardInput()
      }
    }
  }


  /**
   * Determine what direction the tank should move and turn based on keyboard input
   *  
   */
  protected handleKeyboardInput() {
    const status = (label: string) => this.watcher.status[label]

    let moveDir = 0
    let turnDir = 0

    if (status('accel') && status('brake')) {
      moveDir = 0
    } else {
      if (status('accel')) {
        moveDir = Tank.MOVE_FORWARD
      } else if (status('brake')) {
        moveDir = Tank.MOVE_BACKWARD
      }
    }

    if (status('right') && status('left')) {
      turnDir = 0
    } else {
      if (status('right')) {
        turnDir = Tank.TURN_RIGHT
      } else if (status('left')) {
        turnDir = Tank.TURN_LEFT
      }
    }
    this.moveTank(moveDir, turnDir)
  }

  /**
   * Moves the tank
   *  - Currently applies basic movement (lookAt and setLinearVelocity) 
   *  - To be replaced with calls to physics methods (turn wheels)
   */
  protected moveTank(moveDir: number, turnDir: number) {
    let speed = 0

    if (turnDir === 0 && moveDir === 0) {
      return
    } else if (moveDir !== 0) {
      if (turnDir === 0) {

        // Full power to both treads
        speed = moveDir * this.speedMax
      } else {

        // Full power to ONE tread, Slightly less to other
        speed = moveDir * this.speedMax
        this.chassisFacing += turnDir * moveDir * this.turnSpeed
      }
    } else {

      // Full power to ONE tread, Minimum power to other
      speed = this.speedTurn
      this.chassisFacing += turnDir * this.turnSpeed
    }

    // Applies Basic Movement
    const directionVector = new BABYLON.Vector3(Math.sin(this.chassisFacing), 0, Math.cos(this.chassisFacing))
    this.chassis.lookAt(this.chassis.position.add(directionVector), 0, 0, 0)

    if (speed !== 0) {
      const speedVector = new BABYLON.Vector3(speed, 0, speed)
      this.chassis.physicsImpostor.setLinearVelocity(directionVector.multiply(speedVector))
    }
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

  /**
   * Cleanup for removal from the game.
   */
  destructor(): Promise<void> {

    // Remove all meshes from the scene.
    for (const mesh of this.meshes) {
      this.stage.scene.removeMesh(mesh)
    }

    // Cleanup the watcher.
    this.watcher.destructor()

    return Promise.resolve()
  }
}

/**
 * State data for a Tank!
 */
export interface TankState extends EntityData {
  playerControlled?: boolean
  artPath?: string
  position?: number[]
}
