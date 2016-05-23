
import Game, {GameOptions} from "./Engine/Game";

export default class Nanoshooter extends Game {

    constructor(options: NanoshooterOptions) {
        super(options);
        const {engine, canvas, scene} = this;

        scene.clearColor = new BABYLON.Color3(0, 0.1, 0);

        const camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);

        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
        light.intensity = 0.5;

        const sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        sphere.position.y = 1;

        const ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
    }
}

export interface NanoshooterOptions extends GameOptions {}
