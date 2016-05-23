///<reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts"/>
///<reference path="../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Open source web game.
     * @todo: Everything.
     */
    var Nanoshooter = (function () {
        /**
         * Initialize an instance of the Nanoshooter game.
         *   - Create the canvas element.
         *   - Boot up the Babylon game engine.
         */
        function Nanoshooter(hostElement) {
            var startTime = (+new Date);
            this.canvas = document.createElement("canvas");
            this.engine = new BABYLON.Engine(this.canvas, true);
            this.startupDuration = (+new Date) - startTime;
        }
        /**
         * Throw an error on purpose, just to see the debugger in action.
         */
        Nanoshooter.prototype.throwAnError = function () {
            throw "Terrible mistake!";
        };
        return Nanoshooter;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Nanoshooter;
});
//# sourceMappingURL=Nanoshooter.js.map