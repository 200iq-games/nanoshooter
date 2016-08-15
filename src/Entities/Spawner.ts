
import BabylonEntity from 'Susa/BabylonEntity'
import Entity, {EntityOptions, EntityData} from 'Susa/Entity'

/**
 * Just spawns cubes when spacebar is pressed.
 */
export default class Spawner extends BabylonEntity {

  static type = 'Nanoshooter/Entities/Spawner'

  private keyupAction: (event: KeyboardEvent) => void

  constructor(options: EntityOptions) {
    super(options)
    window.addEventListener('keyup', this.keyupAction = (event: KeyboardEvent) => {

      //                Spacebar.
      //                    ↓
      if (event.keyCode === 32) {

        this.game.addEntity({
          type: 'Nanoshooter/Entities/Cube',
          tags: ['SpawnedCube']
        })
      }
    })
  }

  /**
   * Cleanup for removal from the game.
   */
  destructor(): Promise<void> {
    window.removeEventListener('keyup', this.keyupAction)
    return Promise.resolve()
  }
}
