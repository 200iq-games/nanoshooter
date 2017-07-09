

import Nanoshooter from "./Nanoshooter"
import Environment, {EnvironmentEntry} from "./Environment"

const game = new Nanoshooter({
  window,
  canvas: document.querySelector("canvas"),
  state: {
    A123: <EnvironmentEntry>{type: "Environment"}
  },
  entityClasses: {Environment}
})

game.start()

; (<any>window).game = game
