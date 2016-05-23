/// <reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts" />
/// <reference path="../typings/browser.d.ts" />
/**
 * Open source web game.
 * @todo: Everything.
 */
export default class Nanoshooter {
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    /** Game initialization duration, in milliseconds. */
    startupDuration: number;
    /**
     * Initialize an instance of the Nanoshooter game.
     *   - Create the canvas element.
     *   - Boot up the Babylon game engine.
     */
    constructor(hostElement: HTMLElement);
    /**
     * Throw an error on purpose, just to see the debugger in action.
     */
    throwAnError(): void;
}
