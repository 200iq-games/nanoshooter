
import Stateful from "./Stateful";
import Entity from "./Entity";

export default class Game extends Stateful {
    state: GameState;

    constructor(options: GameOptions) {
        super();
        const { host, log } = options;
        const startTime = (+new Date);

        this.state = {
            entities: {}
        };

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
        log(`Loading ————————→ ${(startTime - performance.timing.navigationStart).toFixed(0)} ms`);
        log(`Game init ——————→ ${(endTime - startTime).toFixed(0)} ms`);
        log(`TOTAL startup ——→ ${(endTime - performance.timing.navigationStart).toFixed(0)} ms`);
        log(``);
    }

    nextId = 0;
    pullId = () => (++this.nextId).toString();
    attach(...entities: Entity[]) {
        for (const entity of entities) {
            let id = this.pullId();
            entity.attach(this, id);
            this.state.entities[id] = entity;
        }
    }
}

export interface GameOptions {
    host: HTMLElement;
    log: Logger;
}

export type Logger = (...messages: string[]) => void;

export interface GameState {
    entities: {
        [id: string]: Entity;
    };
}
