
import Spectator, {SpectatorEntry} from "monarch-engine/o/playground/entities/Spectator"

import Nanoshooter from "./Nanoshooter"
import Tank, {TankEntry} from "./entities/Tank"
import Environment, {EnvironmentEntry} from "./entities/Environment"

const game = new Nanoshooter({
  window,
  canvas: document.querySelector("canvas"),
  entityClasses: {Environment, Spectator, Tank}
})

game.monarch.addEntry<EnvironmentEntry>({
  type: "Environment",
  babylonFile: "assets/arena/arena.babylon"
})

game.monarch.addEntry<SpectatorEntry>({
  type: "Spectator",
  position: [-8, 8, 12]
})

game.monarch.addEntry<TankEntry>({
  type: "Tank",
  babylonFile: "assets/tanks/alpha/tank-alpha.babylon",
  position: [8, 0.5, 4],
})

game.susa.start()

; (<any>window).game = game