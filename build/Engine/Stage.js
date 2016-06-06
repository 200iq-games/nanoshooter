define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Govern a 3D Babylon scene from a high level.
     */
    var Stage = (function () {
        function Stage(options) {
            var _this = this;
            this.pick = new BABYLON.PickingInfo();
            /** Nifty diagnostics. */
            this.stats = {
                totalFrames: 0
            };
            /** Event listeners that start and stop with the stage. */
            this.listeners = {
                resize: function () {
                    _this.engine.resize();
                },
                mousemove: function () {
                    _this.pick = _this.scene.pick(_this.scene.pointerX, _this.scene.pointerY);
                }
            };
            this.lastRenderTime = performance.now();
            this.hostElement = options.hostElement;
            this.initialize();
        }
        /**
         * Create an empty Babylon scene.
         */
        Stage.prototype.initialize = function () {
            this.canvas = document.createElement("canvas");
            this.hostElement.appendChild(this.canvas);
            this.engine = new BABYLON.Engine(this.canvas, true);
            this.scene = new BABYLON.Scene(this.engine);
        };
        /**
         * Start the rendering loop.
         */
        Stage.prototype.start = function () {
            var _this = this;
            window.addEventListener("resize", this.listeners.resize);
            window.addEventListener("mousemove", this.listeners.mousemove);
            this.engine.runRenderLoop(function () {
                var since = performance.now() - _this.lastRenderTime;
                _this.render({ since: since });
                _this.lastRenderTime = performance.now();
            });
        };
        /**
         * Stop the rendering loop.
         */
        Stage.prototype.stop = function () {
            this.engine.stopRenderLoop();
            window.removeEventListener("resize", this.listeners.resize);
            window.removeEventListener("mousemove", this.listeners.mousemove);
        };
        /**
         * Render a frame.
         */
        Stage.prototype.render = function (_a) {
            var since = _a.since;
            this.scene.render();
            ++this.stats.totalFrames;
        };
        return Stage;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Stage;
});
//# sourceMappingURL=Stage.js.map