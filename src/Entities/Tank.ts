import Entity, {EntityOptions, EntityState, TickInfo} from "../Engine/Entity"

/**
 * It's a full blown tank!
 */
export default class Tank extends Entity {

  static type = "Nanoshooter/Entities/Tank"

  private meshes: BABYLON.Mesh[]

  private bodyMeshes: BABYLON.Mesh[]
  private turretMeshes: BABYLON.Mesh[]

  private tankCore: BABYLON.Mesh
  private tankPivot: BABYLON.Mesh

  initialize() {
    this.loader.loadObject({ path: "tank.obj" }).then(loaded => {
      this.meshes = loaded.meshes
      this.loaded()
    })
  }

  loaded() {
    // TODO: Figure out parenting.
    this.bodyMeshes = this.meshes.filter(mesh => /tank-body/i.test(mesh.name))
    this.turretMeshes = this.meshes.filter(mesh => /tank-turret/i.test(mesh.name))
    this.tankCore = this.meshes.find(mesh => /tank-core/i.test(mesh.name))
    this.tankPivot = this.meshes.find(mesh => /tank-pivot/i.test(mesh.name))

    // Moving all meshes.. together..
    for (const mesh of this.meshes) {
      mesh.position.y += 2.5
    }
  }

  /**
   * Game logic run every tick.
   */
  logic(state: EntityState, tickInfo: TickInfo): { stateDelta: any } {

    // Aim the tank's gun turret toward the user's cursor.
    if (this.meshes && this.stage.pick.hit) {
      const pickedPoint = this.stage.pick.pickedPoint
      const aim = BABYLON.Vector3.Zero()
      aim.copyFrom(pickedPoint)
      for (const mesh of this.turretMeshes) {
        aim.y = mesh.position.y
        mesh.lookAt(aim, 0, 0, 0)
      }
    }

    return {stateDelta: {}}
  }
}
