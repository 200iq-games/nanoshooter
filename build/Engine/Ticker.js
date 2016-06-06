define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Stop/start controls for generic ticking loops.
     */
    var Ticker = (function () {
        /**
         * Create a ticker with an action function which will be called repeatedly.
         */
        function Ticker(_a) {
            var tick = _a.tick, _b = _a.relax, relax = _b === void 0 ? 10 : _b;
            /** Total ticker time, which actually pauses when the ticker is paused. */
            this.timeline = 0;
            /** Nifty statistics. */
            this.stats = {
                totalTicks: 0
            };
            this.lastTickTime = performance.now();
            this.tick = tick;
            this.relax = relax;
        }
        /**
         * Start the recursive ticking loop.
         */
        Ticker.prototype.start = function () {
            var _this = this;
            // If stopTickingCallback is set, call it, clear it, and stop the recursive ticking process by returning.
            if (this.stopTickingCallback) {
                this.stopTickingCallback();
                this.stopTickingCallback = null;
                return;
            }
            // Gather 'start' timings.
            var now = performance.now();
            var timeSince = now - this.lastTickTime;
            this.timeline += timeSince;
            var tickStartTime = now;
            // Call the TickAction.
            this.tick({
                timeSince: timeSince,
                timeline: this.timeline
            });
            // Gather 'after' timings.
            now = performance.now();
            this.lastTickTime = now;
            var tickTime = now - tickStartTime;
            ++this.stats.totalTicks;
            // Recurse, but give the browser some time to relax.
            setTimeout(function () {
                window.requestAnimationFrame(function () {
                    _this.start();
                });
            }, this.relax);
        };
        /**
         * Halt the ticker.
         */
        Ticker.prototype.stop = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.stopTickingCallback = function () { return resolve(); };
            });
        };
        return Ticker;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ticker;
});
//# sourceMappingURL=Ticker.js.map