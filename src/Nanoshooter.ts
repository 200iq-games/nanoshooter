
///<reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts"/>
///<reference path="../typings/browser.d.ts"/>

import State from "./State";

/**
 * Open source web game.
 * @todo: Everything.
 */
export default class Nanoshooter {

    /** Serializable game state. */
    private state: State;

    /**
     * Initialize an instance of the Nanoshooter game.
     */
    constructor(options: NanoshooterOptions) {
        const { host, log, state } = options;
        const startTime = (+new Date);

        const canvas = document.createElement("canvas");
        host.appendChild(canvas);

        const engine = new BABYLON.Engine(canvas, true);
        const scene = (() => {
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color3(0, 0.1, 0);
            const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.attachControl(canvas, false);
            const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
            light.intensity = 0.5;
            const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
            sphere.position.y = 1;
            const ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
            return scene;
        })();

        engine.runRenderLoop(() => scene.render());
        window.addEventListener("resize", () => engine.resize());

        const endTime = (+new Date);
        log(``);
        log(`Loading time ————————→ ${(startTime - performance.timing.navigationStart).toFixed(0)} ms`);
        log(`Game initialization —→ ${(endTime - startTime).toFixed(0)} ms`);
        log(`Total startup time ——→ ${(endTime - performance.timing.navigationStart).toFixed(0)} ms`);
        log(``);
    }
}

export interface NanoshooterOptions {
    state: State;
    host: HTMLElement;
    log: Logger;
}

export type Logger = (...messages: string[]) => void;
