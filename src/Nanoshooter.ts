
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
    constructor(hostElement: HTMLElement) {
        const startTime = (+new Date);

        // Establish the canvas, insert it into the host element.
        const canvas = document.createElement("canvas");
        hostElement.appendChild(canvas);

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

        // Log game initialization duration.
        const startupDuration = (+new Date) - startTime;
        console.debug(`Game took ${startupDuration.toFixed(0)}ms to initialize.`);
    }

    /**
     * Throw an error on purpose, just to see the debugger in action.
     */
    throwAnError() {
        throw "Terrible mistake!";
    }
}
