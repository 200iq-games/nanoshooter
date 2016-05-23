
import Game from "./Game";
import {TickInfo} from "./Ticker";

/**
 * Something like a film director who reads the game's state like it's a screenplay, and uses Babylon as the set to reproduce the scene.
 */
export default class Director {

    /** Parent game reference. */
    game: Game;

    // Babylon specifics.
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    /** Nifty debug info. */
    diagnostics = {
        totalFrames: 0
    };

    /**
     * Create a blank game world in Babylon.
     */
    constructor(options: DirectorOptions) {
        this.game = options.game;

        // Initializing a blank Babylon scene.
        this.canvas = document.createElement("canvas");
        options.hostElement.appendChild(this.canvas);
        this.engine = new BABYLON.Engine(this.canvas, true); // Canvas must already be attached to the document.
        this.scene = new BABYLON.Scene(this.engine);
        window.addEventListener("resize", () => this.engine.resize());
    }

    /**
     * Render a frame.
     */
    render(info: TickInfo) {
        this.scene.render();
        ++this.diagnostics.totalFrames;
    }

    /**
     * Start the rendering loop.
     */
    start() {
        this.engine.runRenderLoop(() => {
            const since = performance.now() - this.lastRenderTime;
            this.render({since});
            this.lastRenderTime = performance.now();
        });
    }
    lastRenderTime = performance.now();

    /**
     * Stop the rendering loop.
     */
    stop() {
        this.engine.stopRenderLoop();
    }
}

/**
 * Structure of options that a new director takes.
 */
export interface DirectorOptions {
    game: Game;
    hostElement: HTMLElement;
}
