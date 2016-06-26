
import Game, {GameOptions} from "./Framework/Game"
import Stage from "./Framework/Stage"
import {EntityState} from "./Framework/Entity"
import {TankState} from "./Entities/Tank"

/**
 * Nanoshooter game.
 * Subclass of Game, which has start/stop methods, etc.
 */
export default class Nanoshooter extends Game {

  initialize() {
    super.initialize()
    const {canvas, scene} = this.stage

    // Physics.
    const gravity = new BABYLON.Vector3(0, -9.81, 0)
    scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin())

    // Background color.
    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.2)

    // Lights.
    const toplight = new BABYLON.DirectionalLight("sunlight", new BABYLON.Vector3(0.2, -1, 0.3), scene)
    const backlight = new BABYLON.DirectionalLight("backlight", new BABYLON.Vector3(-0.76, -0.8, -0.44), scene)
    toplight.intensity = 0.8
    backlight.intensity = 0.4

    // Camera.
    const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-5, 15, -15), scene)
    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvas, false)

    // Action!
    this.createInitialEntities()
  }

  createInitialEntities() {

    // Floor.
    this.addEntity({
      type: "Nanoshooter/Entities/Floor",
      label: "FancyFloor"
    })

    // If the page has a querystring, display an empty scene with the art viewer.
    if (location.search) {

      // Art viewer.
      this.addEntity({
        type: "Nanoshooter/Entities/ArtViewer",
        label: "ArtViewer"
      })

    // Load up some kind of demo scene.
    } else {

      // Tank alpha.
      this.addEntity<TankState>({
        type: "Nanoshooter/Entities/Tank",
        label: "TankAlpha",
        playerControlled: true,
        artPath: "art/tanks/alpha/tank-alpha.obj",
        position: [-4, 0, 0]
      })

      // Tank bravo.
      this.addEntity<TankState>({
        type: "Nanoshooter/Entities/Tank",
        label: "TankBravo",
        artPath: "art/tanks/bravo/tank-bravo.obj",
        position: [4, 0, 0]
      })

      // Spawner.
      this.addEntity({
        type: "Nanoshooter/Entities/Spawner",
        label: "Spawnlord"
      })

    }

    // // Robot.
    // this.addEntity(new EntityState({
    //   type: "Nanoshooter/Entities/Robot",
    //   label: "Robot"
    // }))

    // // Cube.
    // this.addEntity(new EntityState({
    //     type: "Nanoshooter/Entities/Cube",
    //     label: "FancyCube"
    // }))
  }
}
