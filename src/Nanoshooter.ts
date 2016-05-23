
///<reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts"/>

/**
 * Open source web game.
 * @todo: Everything.
 */
export default class Nanoshooter {
    awesome: boolean;
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;

    constructor() {
        const startTime = (+new Date);

        this.awesome = true;
        this.canvas = document.createElement("canvas");
        this.engine = new BABYLON.Engine(this.canvas, true);

        const startupDuration = ((+new Date) - startTime);
        console.debug(`Game took ${startupDuration.toFixed(0)}ms to initialize.`);
    }

    throwAnError() {
        throw "Terrible mistake!";
    }
}
