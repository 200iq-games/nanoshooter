
/**
 * Loads art assets.
 */
export default class Loader {
  private scene: BABYLON.Scene
  private rootUrl: string

  constructor(options: ObjectLoaderOptions) {
    this.scene = options.scene
    this.rootUrl = options.rootUrl
  }

  /**
   * Load a ".obj" file, relative to this loader's root url.
   * Returns a promise of a loaded object report, which contains the meshes.
   */
  loadObject({path}: LoadObjectOptions): Promise<LoadedObjectReport> {
    return new Promise<LoadedObjectReport>((resolve, reject) => {
      const assetsManager = new BABYLON.AssetsManager(this.scene)
      assetsManager.useDefaultLoadingScreen = false
      const meshTask = assetsManager.addMeshTask(
        performance.now().toString(),
        null,
        this.rootUrl,
        path
      )
      meshTask.onSuccess = task => {
        resolve({
          meshes: <BABYLON.Mesh>(<any>task).loadedMeshes
        })
      }
      meshTask.onError = reject
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
  meshes: any
}

/**
 * Inputs for creating a loader.
 */
export interface ObjectLoaderOptions {

  /** Current babylon scene to load things into. */
  scene: BABYLON.Scene

  /** Load object files relative to this root directory URL. */
  rootUrl: string
}
