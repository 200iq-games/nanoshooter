
import Game, {GameOptions} from "./Engine/Game"
import Stage from "./Engine/Stage"
import {EntityState} from "./Engine/Entity"

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
    scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8)

    // Lights.
    const toplight = new BABYLON.DirectionalLight("sunlight", new BABYLON.Vector3(0.2, -1, 0.3), scene)
    const forelight = new BABYLON.DirectionalLight("forelight", new BABYLON.Vector3(0.8, -0.8, 0.5), scene)
    const backlight = new BABYLON.DirectionalLight("backlight", new BABYLON.Vector3(-0.76, -0.8, -0.44), scene)
    const underlight = new BABYLON.DirectionalLight("underlight", new BABYLON.Vector3(-0.28, 1, -0.22), scene)
    toplight.intensity = forelight.intensity = backlight.intensity = 0.3
    underlight.intensity = 0.1

    // Camera.
    const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(-5, 15, -15), scene)
    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvas, false)

    // Action!
    this.createInitialEntities()
  }

  createInitialEntities() {

    // Floor.
    this.addEntity(new EntityState({
      type: "Nanoshooter/Entities/Floor",
      label: "FancyFloor"
    }))

    // Tank alpha.
    this.addEntity(new EntityState({
      type: "Nanoshooter/Entities/Tanks/TankAlpha",
      label: "TankAlpha"
    }))

    // Tank bravo.
    this.addEntity(new EntityState({
      type: "Nanoshooter/Entities/Tanks/TankBravo",
      label: "TankBravo"
    }))

    // // Spawner.
    // this.addEntity(new EntityState({
    //   type: "Nanoshooter/Entities/Spawner",
    //   label: "Spawnlord"
    // }))

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
