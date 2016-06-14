
/**
 * Loads art assets.
 */
export default class Loader {
  protected scene: BABYLON.Scene

  constructor(options: ObjectLoaderOptions) {
    this.scene = options.scene
  }

  /**
   * Load a ".obj" file, relative to this loader's root url.
   * Returns a promise of a loaded object report, which contains the meshes.
   */
  loadObject({path}: LoadObjectOptions): Promise<LoadedObjectReport> {
    return new Promise<LoadedObjectReport>((resolve, reject) => {

      // Work a little magic to distinguish the directory path from the filename, which Babylon wants.
      const {dir, objFileName} = (() => {
        let dir = ''
        let objFileName = ''
        if (path.includes('/')) {
          const parts = path.split('/')
          objFileName = parts.pop()
          dir = parts.join('/') + '/'
        } else {
          objFileName = path
        }
        return {dir, objFileName}
      })()

      // Create a Babylon assets manager.
      const assetsManager = new BABYLON.AssetsManager(this.scene)
      assetsManager.useDefaultLoadingScreen = false

      // Create a mesh task to load.
      const meshName = performance.now().toString() // like totally w/e
      const meshTask = assetsManager.addMeshTask(meshName, null, dir, objFileName)
      meshTask.onSuccess = task => {
        resolve({
          meshes: <BABYLON.Mesh[]>(<any>task).loadedMeshes
        })
      }
      meshTask.onError = reject

      // Start loading.
      assetsManager.load()
    })
  }
}

/**
 * Options for loading an object.
 */
export interface LoadObjectOptions {

  /** URL to the ".obj" file, relative from the loader's root url. */
  path: string
}

/**
 * Report returned when an object finishes loading.
 */
export interface LoadedObjectReport {
  meshes: BABYLON.Mesh[]
}

/**
 * Inputs for creating a loader.
 */
export interface ObjectLoaderOptions {

  /** Current babylon scene to load things into. */
  scene: BABYLON.Scene
}
