
import Entity, {EntityState, EntityStateOptions} from "../Engine/Entity"

/**
 * Spawns stuff.
 */
export default class Spawner extends Entity {

  static type = "Nanoshooter/Entities/Spawner"

  private keyupAction: (event: KeyboardEvent) => void

  protected initialize() {
    window.addEventListener("keyup", this.keyupAction = (event: KeyboardEvent) => {

      //                Spacebar.
      //                    ↓
      if (event.keyCode === 32) {

        this.game.addEntity(new EntityState({
          type: "Nanoshooter/Entities/Cube",
          label: "SpawnedCube"
        }))
      }
    })
  }

  removal() {
    window.removeEventListener("keyup", this.keyupAction)
  }
}
