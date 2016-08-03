
import Game, {GameOptions} from 'susa/src/Game'
import Stage from 'susa/src/Stage'
import {EntityState} from 'susa/src/Entity'
import Watcher, { Input } from 'susa/src/Watcher'

import {TankState} from './Entities/Tank'

/**
 * Nanoshooter game.
 * Establishes the scene's fundamentals (like floor).
 * Adds entities.
 * Responds to user input (respawning and such).
 * Manages which camera is active.
 */
export default class Nanoshooter extends Game {

  /**
   * Watch for spawn button press.
   */
  watcher: Watcher = new Watcher({
    bindings: {
      'spawn': Input.Space
    }
  })

  /**
   * Initialize the Nanoshooter game.
   */
  constructor(options: GameOptions) {
    super(options)
    const {canvas, scene} = this.stage

    // Physics.
    const gravity = new BABYLON.Vector3(0, -9.81, 0)
    scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin())

    // Background color.
    scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.2)

    // Lights.
    const toplight = new BABYLON.DirectionalLight('sunlight', new BABYLON.Vector3(0.2, -1, 0.3), scene)
    const backlight = new BABYLON.DirectionalLight('backlight', new BABYLON.Vector3(-0.76, -0.8, -0.44), scene)
    toplight.intensity = 0.8
    backlight.intensity = 0.4

    // Camera.
    const camera = new BABYLON.UniversalCamera('fallback-camera', new BABYLON.Vector3(-5, 15, -15), scene)
    camera.setTarget(BABYLON.Vector3.Zero())
    camera.attachControl(canvas, false)

    // Floor.
    this.addEntity({
      type: 'Nanoshooter/Entities/Floor',
      tags: ['FancyFloor']
    })

    // If the page has a querystring, display an empty scene with the art viewer.
    if (location.search) {

      // Art viewer.
      this.addEntity({
        type: 'Nanoshooter/Entities/ArtViewer',
        tags: ['ArtViewer']
      })
    }

    // Load up some kind of demo scene.
    else {

      // Spawn tank alpha whenever the spawn key is pressed.
      this.watcher.on('spawn', report => {
        if (!!report.status)
          this.addEntity<TankState>({
            type: 'Nanoshooter/Entities/Tank',
            tags: ['tank', 'alpha'],
            playerControlled: true,
            artPath: 'art/tanks/alpha/tank-alpha.obj',
            position: [-4, 0, 0]
          })
      })

      // Tank bravo.
      this.addEntity<TankState>({
        type: 'Nanoshooter/Entities/Tank',
        tags: ['tank', 'bravo'],
        artPath: 'art/tanks/bravo/tank-bravo.obj',
        position: [4, 0, 0]
      })

      // Spawner.
      this.addEntity({
        type: 'Nanoshooter/Entities/Spawner',
        tags: ['spawnlord']
      })

      // Spectator.
      this.addEntity({
        type: 'Nanoshooter/Entities/Spectator',
        tags: ['spectator']
      })
    }
  }

  /**
   * Shutdown the game.
   */
  destructor() {
    this.watcher.destructor()
  }
}
