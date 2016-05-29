
import Entity, {EntityOptions} from "../Engine/Entity"

/**
 * Spawns stuff.
 */
export default class Spawner extends Entity {

    static type = "Nanoshooter/Entities/Spawner"

    private mesh: BABYLON.Mesh

    private keybindCallback

    initialize() {
        this.keybindCallback = (event: KeyboardEvent) => {
            if (event.keyCode === 32)
                this.game.addEntity({
                    type: "Nanoshooter/Entities/Cube",
                    label: "SpawnedCube"
                })
        }
        window.addEventListener("keyup", this.keybindCallback)
    }

    removal() {
        window.removeEventListener("keyup", this.keybindCallback)
    }
}