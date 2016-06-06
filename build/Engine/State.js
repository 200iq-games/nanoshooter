define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * State object with operations for applying deltas and performing diffs.
     */
    var State = (function () {
        function State() {
        }
        /**
         * Apply a delta onto a state, and return the diff.
         */
        State.applyDelta = function (state, delta) { throw "Coming soon"; };
        /**
         * Return the delta diff between two states.
         */
        State.diff = function (alpha, beta) { throw "Coming soon"; };
        /** Apply a delta onto this state. */
        State.prototype.applyDelta = function (delta) { return State.applyDelta(this, delta); };
        /** Generate a diff from this state to a provided one. */
        State.prototype.diff = function (beta) { return State.diff(this, beta); };
        return State;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = State;
    /**
     * Take action on an object and all of its set properties.
     */
    function recursiveAction(subject, action) {
        action(subject);
        for (var _i = 0, _a = Object.keys(subject); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = subject[key];
            recursiveAction(value, action);
        }
    }
});
//# sourceMappingURL=State.js.map