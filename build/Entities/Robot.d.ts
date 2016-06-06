import Entity, { EntityState, TickInfo } from "../Engine/Entity";
/**
 * A simple cube object in the game world.
 */
export default class Robot extends Entity {
    static type: string;
    private mesh;
    private listeners;
    private movement;
    protected initialize(): void;
    /**
     * Action taken after the robot mesh has loaded.
     */
    protected loaded(): void;
    /**
     * Game logic run every tick.
     */
    logic(state: EntityState, tickInfo: TickInfo): {
        stateDelta: any;
    };
    removal(): void;
}
