
import Entity, {EntityState, EntityStateOptions} from "../Engine/Entity"

/**
 * Spawns stuff.
 */
export default class Spawner extends Entity {

    static type = "Nanoshooter/Entities/Spawner"

    private mesh: BABYLON.Mesh

    private keybindCallback

    protected initialize() {
        this.keybindCallback = (event: KeyboardEvent) => {
            if (event.keyCode === 32) {
                this.game.addEntity(new EntityState({
                    type: "Nanoshooter/Entities/Cube",
                    label: "SpawnedCube"
                }))
            }
        }
        window.addEventListener("keyup", this.keybindCallback)
    }

    removal() {
        window.removeEventListener("keyup", this.keybindCallback)
    }
}
