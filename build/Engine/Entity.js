var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./State"], function (require, exports, State_1) {
    "use strict";
    /**
     * Entity in the game world which responds to fresh entity state on logic ticks.
     * An entity doesn't actually need to persist any state, fresh state can just pass through the logic method.
     */
    var Entity = (function () {
        /**
         * Create a new entity instance.
         * You can optionally provide your own label for each instance.
         */
        function Entity(options) {
            this.tag = options.tag;
            this.label = options.label || "";
            this.game = options.game;
            this.stage = options.stage;
            this.initialize();
        }
        /**
         * Initialize this entity.
         */
        Entity.prototype.initialize = function () { };
        /**
         * Respond to fresh entity state on a logic tick.
         */
        Entity.prototype.logic = function (state, tickInfo) { return undefined; };
        /**
         * Handle being removed from the game.
         * Tear down any event subscriptions.
         */
        Entity.prototype.removal = function () { };
        /**
         * Entity's aesthetic appearance in debugging logs.
         */
        Entity.prototype.toString = function () { return "<" + this.tag + (this.label ? '-' : '') + this.label + ">"; };
        /** Module ID for this entity class. Used to load entity classes on-the-fly. */
        Entity.type = "Nanoshooter/Entities/Entity";
        return Entity;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Entity;
    var EntityState = (function (_super) {
        __extends(EntityState, _super);
        function EntityState(options) {
            _super.call(this);
            if (!options.type)
                throw "Entity state requires type.";
            this.type = options.type;
            this.label = options.label;
        }
        return EntityState;
    }(State_1.default));
    exports.EntityState = EntityState;
});
//# sourceMappingURL=Entity.js.map