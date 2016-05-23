
///<reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts"/>
///<reference path="../typings/browser.d.ts"/>

/**
 * Open source web game.
 * @todo: Everything.
 */
export default class Nanoshooter {

    /**
     * Initialize an instance of the Nanoshooter game.
     *   - Create the canvas element.
     *   - Boot up the Babylon game engine.
     */
    constructor(settings: NanoshooterSettings = {}) {
        const startTime = (+new Date);

        // Host element that contains the canvas.
        const host: HTMLElement = settings.host || document.body;

        // Log function for outputting debug information to the console.
        const log: Logger = settings.log || ((...messages: any[]) => console.debug.apply(console, messages));

        // Establish the canvas, insert it into the host element.
        const canvas = document.createElement("canvas");
        host.appendChild(canvas);

        // Initialize the Babylon engine.
        const engine = new BABYLON.Engine(canvas, true);

        // Create a demo scene.
        const scene = (() => {
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color3(0, 0.1, 0);
            const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.attachControl(canvas, false);
            const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            light.intensity = .5;
            const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
            sphere.position.y = 1;
            const ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
            return scene;
        })();

        // Initiate render loop.
        engine.runRenderLoop(() => scene.render());

        // Handle browser resize.
        window.addEventListener("resize", () => engine.resize());

        // Logging some timings.
        const endTime = (+new Date);
        log(``);
        log(`Loading time ————————→ ${(startTime - performance.timing.navigationStart).toFixed(0)} ms`);
        log(`Game initialization —→ ${(endTime - startTime).toFixed(0)} ms`);
        log(`Total startup time ——→ ${(endTime - performance.timing.navigationStart).toFixed(0)} ms`);
        log(``);
    }

    /**
     * Throw an error on purpose, just to see the debugger in action.
     */
    throwAnError() {
        throw "Terrible mistake!";
    }
}

/**
 * Inputs for a Nanoshooter instance.
 */
export interface NanoshooterSettings {
    host?: HTMLElement;
    log?: Logger;
}

/** Outputs debugging-oriented log messages. */
export type Logger = (...messages: string[]) => void;
