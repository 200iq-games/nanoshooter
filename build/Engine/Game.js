var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Stage", "./World", "./Ticker", "./State"], function (require, exports, Stage_1, World_1, Ticker_1, State_1) {
    "use strict";
    /**
     * 3D web game infrastructure.
     */
    var Game = (function () {
        /**
         * Initialize a game.
         * Create and wire up the engine components that the game is comprised of.
         */
        function Game(_a) {
            var _this = this;
            var _b = _a === void 0 ? {} : _a, log = _b.log, hostElement = _b.hostElement;
            // Attach the public logging function.
            this.log = log;
            // Create the Babylon stage.
            this.stage = new Stage_1.default({ hostElement: hostElement });
            // Create the source-of-truth game state.
            this.state = new GameState();
            // Create the game world, which contains entity instances and conforms to the game state.
            this.world = new World_1.default({ game: this, stage: this.stage });
            // Create the ticker which runs game logic.
            this.logicTicker = new Ticker_1.default({
                // Function for each logic tick.
                tick: function (tickInfo) {
                    // Sync the game world to match the game state.
                    _this.world.conform(_this.state);
                    // Run all entity logic.
                    _this.world.loopOverEntities(function (entity, tag) { return entity.logic(_this.state.getEntity(tag), tickInfo); });
                }
            });
            // Initialize this game.
            this.initialize(this.stage);
        }
        /** Overridable game initialization step. */
        Game.prototype.initialize = function (stage) { };
        /**
         * Add an entity to the game based on the provided entity state.
         * TODO: Make this return a promise of the true Entity instance within the World.
         */
        Game.prototype.addEntity = function (entityState) {
            this.state.addEntity(entityState);
        };
        /**
         * Remove an entity from the state based on the provided entity tag string.
         * TODO: Make this return a promise that is resolved when the entity instance is actually removed from the world.
         */
        Game.prototype.removeEntity = function (tag) {
            this.state.removeEntity(tag);
        };
        /**
         * Run the whole game engine.
         */
        Game.prototype.start = function () {
            this.stage.start();
            this.logicTicker.start();
        };
        /**
         * Halt the whole game engine.
         */
        Game.prototype.stop = function () {
            this.stage.stop();
            return this.logicTicker.stop();
        };
        /**
         * Return the current number of frames being rendered per second.
         */
        Game.prototype.getFramerate = function () {
            return this.stage.engine.getFps();
        };
        return Game;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Game;
    var GameState = (function (_super) {
        __extends(GameState, _super);
        function GameState() {
            var _this = this;
            _super.apply(this, arguments);
            /** Collection of entity state. */
            this.entities = {};
            /** Entity tag pulling station. */
            this.pullTag = function () { return (++_this.nextTag).toString(); };
            this.nextTag = 0;
        }
        /**
         * Loop over each entity state.
         */
        GameState.prototype.loopOverEntities = function (looper) {
            for (var _i = 0, _a = Object.keys(this.entities); _i < _a.length; _i++) {
                var tag = _a[_i];
                looper(this.entities[tag], tag);
            }
        };
        /**
         * Obtain a particular entity's state.
         */
        GameState.prototype.getEntity = function (tag) {
            return this.entities[tag];
        };
        /**
         * Add entity state data.
         */
        GameState.prototype.addEntity = function (entityState) {
            this.entities[this.pullTag()] = entityState;
        };
        /**
         * Remove an entity by state.
         */
        GameState.prototype.removeEntity = function (tag) {
            delete this.entities[tag];
        };
        return GameState;
    }(State_1.default));
    exports.GameState = GameState;
});
//# sourceMappingURL=Game.js.map