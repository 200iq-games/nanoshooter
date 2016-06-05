
import Game, {GameOptions} from "./Engine/Game"
import Stage from "./Engine/Stage"
import {EntityState} from "./Engine/Entity"

/**
 * Create some kind of demo scene, which is apparently supposed to be some kind of early version of Nanoshooter..
 */
export default class Nanoshooter extends Game {

    initialize(stage: Stage) {
        super.initialize(stage)
        const {canvas, scene} = stage

        // Physics.
        const gravity = new BABYLON.Vector3(0, -9.81, 0)
        scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin())

        // Background color.
        scene.clearColor = new BABYLON.Color3(0, 0.1, 0)

        // Lights.
        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene)
        light.intensity = 0.5

        // Camera.
        const camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene)
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

        // Cube.
        this.addEntity(new EntityState({
            type: "Nanoshooter/Entities/Cube",
            label: "FancyCube"
        }))

        // Spawner.
        this.addEntity(new EntityState({
            type: "Nanoshooter/Entities/Spawner",
            label: "Spawnlord"
        }))
    }
}
