

import Entity, {EntityOptions, EntityState, TickInfo} from "../Engine/Entity"

/**
 * A simple cube object in the game world.
 */
export default class Robot extends Entity {

    static type = "Nanoshooter/Entities/Robot"

    private mesh: BABYLON.Mesh

    private listeners: { keydown: (event: KeyboardEvent) => void; keyup: (event: KeyboardEvent) => void }
    
    private movement: BABYLON.Vector3 = BABYLON.Vector3.Zero()

    protected initialize() {

        // Keyboard listeners.
        {
            this.listeners = {
                keydown: event => {
                    if (event.keyCode === 87) this.movement.z = 1
                    else if (event.keyCode === 83) this.movement.z = -1
                    else if (event.keyCode === 65) this.movement.x = -1
                    else if (event.keyCode === 68) this.movement.x = 1
                },
                keyup: event => {
                    if (event.keyCode === 87) this.movement.z = 0
                    else if (event.keyCode === 83) this.movement.z = 0
                    else if (event.keyCode === 65) this.movement.x = 0
                    else if (event.keyCode === 68) this.movement.x = 0
                }
            }
            window.addEventListener("keydown", this.listeners.keydown)
            window.addEventListener("keyup", this.listeners.keyup)
        }

        // OBJ loading.
        {
            const assetsManager = new BABYLON.AssetsManager(this.stage.scene)
            const meshTask = assetsManager.addMeshTask("mesh", "", "./art/", "robot.obj")
            meshTask.onSuccess = task => {
                this.mesh = <BABYLON.Mesh>(<any>task).loadedMeshes[0]
                this.loaded()
            }
            assetsManager.useDefaultLoadingScreen = false
            assetsManager.load()
        }
    }

    /**
     * Action taken after the robot mesh has loaded.
     */
    protected loaded() {

        // Move up a little, so it spawns above the floor.
        this.mesh.position.y += 2

        // Physics imposter is just a box.
        this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.mesh,
            BABYLON.PhysicsImpostor.BoxImpostor,
            {mass: 1, restitution: 0.1, friction: 0.05},
            this.stage.scene
        )
    }

    /**
     * Game logic run every tick.
     */
    logic(state: EntityState, tickInfo: TickInfo): { stateDelta: any } {

        // Wait for the mesh to be loaded.
        if (this.mesh) {

            // When the mouse cursor is landing on something, and its not this robot mesh.
            if (this.stage.pick.hit && this.stage.pick.pickedMesh !== this.mesh && !this.stage.pick.pickedMesh["cube"]) {
                // Rotate at the aim point, which is Y+1 above the actual picked point.
                const aimPoint = this.stage.pick.pickedPoint.add(new BABYLON.Vector3(0, 1, 0))
                this.mesh.lookAt(aimPoint, 0, 0, 0)
            }

            // Apply movement impulses.
            const t = tickInfo.timeSince / 20
            const impulse = this.movement.multiply(new BABYLON.Vector3(t, t, t))
            this.mesh.applyImpulse(impulse, this.mesh.position)
        }

        return {stateDelta: {}}
    }

    removal() {
        {
            if (this.mesh) this.mesh.dispose
            this.mesh = null
        }
        {
            window.removeEventListener("keydown", this.listeners.keydown)
            window.removeEventListener("keyup", this.listeners.keyup)
        }
    }
}

