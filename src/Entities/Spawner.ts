
import Entity, {EntityState} from "../Engine/Entity"

/**
 * Spawns stuff.
 */
export default class Spawner extends Entity {

  static type = "Nanoshooter/Entities/Spawner"

  private keyupAction: (event: KeyboardEvent) => void

  protected initialize(entityState: EntityState) {
    window.addEventListener("keyup", this.keyupAction = (event: KeyboardEvent) => {

      //                Spacebar.
      //                    ↓
      if (event.keyCode === 32) {

        this.game.addEntity({
          type: "Nanoshooter/Entities/Cube",
          label: "SpawnedCube"
        })
      }
    })
  }

  removal() {
    window.removeEventListener("keyup", this.keyupAction)
  }
}
