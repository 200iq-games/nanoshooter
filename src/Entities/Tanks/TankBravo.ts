
import Tank from "../Tank"

export default class TankAlpha extends Tank {
  static type = "Nanoshooter/Entities/Tanks/TankAlpha"

  initialize() {
    this.loadTank("art/tanks/bravo/tank-bravo.obj").then(() => {
      this.chassis.position.x += 4
    })
  }
}
