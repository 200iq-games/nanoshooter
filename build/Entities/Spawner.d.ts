import Entity from "../Engine/Entity";
/**
 * Spawns stuff.
 */
export default class Spawner extends Entity {
    static type: string;
    private keyupAction;
    protected initialize(): void;
    removal(): void;
}
