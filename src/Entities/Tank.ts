import Entity, {EntityLogicInput, EntityLogicOutput} from "../Engine/Entity"

/**
 * It's a full blown tank!
 */
export default class Tank extends Entity {
  static type = "Nanoshooter/Entities/Tank"

  protected meshes: BABYLON.Mesh[]
  protected chassis: BABYLON.Mesh
  protected turret: BABYLON.Mesh

  initialize() {
    this.loadTank("tank-bravo.obj")
  }

  loadTank(path: string): Promise<void> {
    return this.loader.loadObject({path}).then(loaded => {
      this.meshes = loaded.meshes

      this.chassis = this.meshes.find(mesh => /Chassis/i.test(mesh.name))
      this.turret = this.meshes.find(mesh => /Turret/i.test(mesh.name))

      this.turret.parent = this.chassis;
    })
  }

  logic(input: EntityLogicInput): EntityLogicOutput {
    // Aim the tank's gun turret toward the user's cursor.
    if (this.meshes && this.stage.pick.hit)
      this.aimTurret(this.stage.pick.pickedPoint)
  }

  aimTurret(point: BABYLON.Vector3) {
    const aim = BABYLON.Vector3.Zero()
    aim.copyFrom(point)
    aim.subtractInPlace(this.turret.absolutePosition)
    aim.y = this.turret.position.y
    this.turret.lookAt(aim, 0, 0, 0)
  }

  removal() {
    // Remove all meshes from the scene.
    for (const mesh of this.meshes) {
      this.stage.scene.removeMesh(mesh)
    }
  }
}
