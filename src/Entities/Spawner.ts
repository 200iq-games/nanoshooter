
import Entity, {EntityState} from 'Susa/Entity'

/**
 * Just spawns cubes when spacebar is pressed.
 */
export default class Spawner extends Entity {

  static type = 'Nanoshooter/Entities/Spawner'

  private keyupAction: (event: KeyboardEvent) => void

  protected initialize(entityState: EntityState) {
    window.addEventListener('keyup', this.keyupAction = (event: KeyboardEvent) => {

      //                Spacebar.
      //                    ↓
      if (event.keyCode === 32) {

        this.game.addEntity({
          type: 'Nanoshooter/Entities/Cube',
          label: 'SpawnedCube'
        })
      }
    })
  }

  /**
   * Cleanup for removal from the game.
   */
  destructor() {
    window.removeEventListener('keyup', this.keyupAction)
  }
}
