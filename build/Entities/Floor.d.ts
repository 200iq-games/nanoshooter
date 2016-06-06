import Entity from "../Engine/Entity";
/**
 * A floor object for the game world.
 */
export default class Floor extends Entity {
    static type: string;
    private mesh;
    protected initialize(): void;
    removal(): void;
}
