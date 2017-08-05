
import Cube, {CubeEntry} from "monarch-engine/o/common/entities/cube"
import Editor, {EditorEntry} from "monarch-engine/o/common/entities/editor"
import Spectator, {SpectatorEntry} from "monarch-engine/o/common/entities/spectator"

import Nanoshooter from "./nanoshooter"
import Tank, {TankEntry} from "./entities/tank"
import Environment, {EnvironmentEntry} from "./entities/environment"

const game = new Nanoshooter({
  window,
  canvas: document.querySelector("canvas"),
  entityClasses: {Environment, Spectator, Editor, Cube, Tank}
})

game.monarch.addEntry<EnvironmentEntry>({
  type: "Environment",
  babylonFile: "assets/arena/arena.babylon"
})

game.monarch.addEntry<EditorEntry>({
  type: "Editor",
  position: [-8, 8, 12]
})

game.monarch.addEntry<TankEntry>({
  type: "Tank",
  babylonFile: "assets/tanks/alpha/tank-alpha.babylon",
  position: [8, 0.5, 4],
})

game.susa.start()

; (<any>window).game = game
