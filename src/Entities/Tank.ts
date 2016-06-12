import Entity, {EntityOptions, EntityState, TickInfo} from "../Engine/Entity"

/**
 * It's a full blown tank!
 */
export default class Tank extends Entity {

  static type = "Nanoshooter/Entities/Tank"

  private mesh: BABYLON.Mesh

  private listeners: { keydown: (event: KeyboardEvent) => void; keyup: (event: KeyboardEvent) => void }

  private movement: BABYLON.Vector3 = BABYLON.Vector3.Zero()
}
