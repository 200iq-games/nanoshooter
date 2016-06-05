
import Entity, {EntityState, EntityStateOptions} from "../Engine/Entity"

/**
 * Spawns stuff.
 */
export default class Spawner extends Entity {

    static type = "Nanoshooter/Entities/Spawner"

    private mesh: BABYLON.Mesh

    private keyupAction: (event: KeyboardEvent) => void

    protected initialize() {
        this.keyupAction = (event: KeyboardEvent) => {
            if (event.keyCode === 32) {
                this.game.addEntity(new EntityState({
                    type: "Nanoshooter/Entities/Cube",
                    label: "SpawnedCube"
                }))
            }
        }
        window.addEventListener("keyup", this.keyupAction)
    }

    removal() {
        window.removeEventListener("keyup", this.keyupAction)
    }
}
