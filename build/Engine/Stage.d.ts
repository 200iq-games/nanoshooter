/**
 * Govern a 3D Babylon scene from a high level.
 */
export default class Stage {
    hostElement: HTMLElement;
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    pick: BABYLON.PickingInfo;
    /** Nifty diagnostics. */
    private stats;
    /** Event listeners that start and stop with the stage. */
    private listeners;
    constructor(options: StageOptions);
    /**
     * Create an empty Babylon scene.
     */
    initialize(): void;
    /**
     * Start the rendering loop.
     */
    start(): void;
    private lastRenderTime;
    /**
     * Stop the rendering loop.
     */
    stop(): void;
    /**
     * Render a frame.
     */
    private render({since});
}
export interface StageOptions {
    /** HTML element to inject the canvas within. */
    hostElement: HTMLElement;
}
export interface RenderInfo {
    /** Time since the last frame finished rendering. */
    since: number;
}
