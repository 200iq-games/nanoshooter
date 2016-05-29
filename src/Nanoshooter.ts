
import Game, {GameOptions} from "./Engine/Game"
import Stage from "./Engine/Stage"

/**
 * Create some kind of demo scene, which is apparently supposed to be some kind of early version of Nanoshooter..
 */
export default class Nanoshooter extends Game {
    initialize() {
        super.initialize()
        const {canvas, scene} = this

        // Background color.
        scene.clearColor = new BABYLON.Color3(0, 0.1, 0)

        // Camera.
        const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene)
        camera.setTarget(BABYLON.Vector3.Zero())
        camera.attachControl(canvas, false)

        // Lighting.
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene)
        light.intensity = 0.5

        // Physics.
        const gravity = new BABYLON.Vector3(0, -9.81, 0)
        scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin())

        // Starting entities.
        this.createInitialEntities()
    }

    createInitialEntities() {
        // Floor. Most good games feature a floor.
        this.addEntity({
            type: "Nanoshooter/Entities/Floor",
            label: "FancyFloor"
        })

        // Cube. Gotta have something more than just a floor.
        this.addEntity({
            type: "Nanoshooter/Entities/Cube",
            label: "FancyCube"
        })

        // Spawns stuff.
        this.addEntity({
            type: "Nanoshooter/Entities/Spawner",
            label: "Spawnlord"
        })
    }
}
