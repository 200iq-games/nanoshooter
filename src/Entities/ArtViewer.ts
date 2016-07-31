
import Entity, {EntityLogicInput, EntityLogicOutput, EntityState} from 'susa/build/Entity'

/**
 * Preview by providing the art path as a query string.
 * Loads an ".obj" file into the scene upon initialization.
 */
export default class ArtViewer extends Entity {
  static type = 'Nanoshooter/Entities/ArtViewer'

  protected meshes: BABYLON.Mesh[]

  protected initialize(entityState: EntityState) {
    const viewPath = location.search.substr(1)
    if (viewPath)
      this.loadProp(viewPath)
  }

  protected loadProp(path: string) {
    return this.loader.loadObject({path})
      .then(loaded => {
        this.meshes = loaded.meshes
      })
      .catch(error => {
        console.error(`Failed to load .obj file: "${path}"`)
        if (error)
          console.error(error)
      })
  }

  /**
   * Cleanup for removal from the game.
   */
  destructor() {
    for (const mesh of this.meshes) {
      this.stage.scene.removeMesh(mesh)
    }
  }
}
