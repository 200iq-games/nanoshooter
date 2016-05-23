///<reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts"/>
///<reference path="../typings/browser.d.ts"/>
define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Open source web game.
     * @todo: Everything.
     */
    var Nanoshooter = (function () {
        function Nanoshooter() {
            var startTime = (+new Date);
            this.awesome = true;
            this.canvas = document.createElement("canvas");
            this.engine = new BABYLON.Engine(this.canvas, true);
            var startupDuration = (+new Date) - startTime;
            console.debug("Game took " + startupDuration.toFixed(0) + "ms to initialize.");
        }
        Nanoshooter.prototype.throwAnError = function () {
            throw "Terrible mistake!";
        };
        return Nanoshooter;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Nanoshooter;
});
//# sourceMappingURL=Nanoshooter.js.map