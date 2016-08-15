
import BabylonEntity from 'Susa/BabylonEntity'
import Entity, {EntityOptions, EntityData} from 'Susa/Entity'

/**
 * Preview by providing the art path as a query string.
 * Loads an ".obj" file into the scene upon initialization.
 */
export default class ArtViewer extends BabylonEntity {

  static type = 'Nanoshooter/Entities/ArtViewer'

  /** Array of all meshes added by this art viewer. */
  protected meshes: BABYLON.Mesh[] = []

  /**
   * Create an ArtViewer.
   */
  constructor(options: EntityOptions) {
    super(options)
    const viewPath = location.search.substr(1)
    if (viewPath)
      this.loadProp(viewPath)
  }

  /**
   * Cleanup for removal from the game.
   */
  destructor(): Promise<void> {
    for (const mesh of this.meshes) {
      this.stage.scene.removeMesh(mesh)
    }
    return Promise.resolve()
  }

  /**
   * Load a prop into the scene.
   */
  protected loadProp(path: string) {

    // Use the stage loader to load the asset.
    return this.stage.loader.loadAsset({path})

      // Add every loaded mesh to the meshes array.
      .then(loaded => {
        for (const mesh of loaded.meshes)
          this.meshes.push(mesh)
      })

      // TODO: Use a logger to emit this warning.
      .catch(error => {
        console.error(`Failed to load .obj file: "${path}"`)
        console.error(error)
      })
  }
}
