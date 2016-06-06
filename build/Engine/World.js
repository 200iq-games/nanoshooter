define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Contain the entity instances of the game world.
     * Synchronizes with provided game state by adding or removing entities.
     * Responsible for dynamically loading and instancing entities.
     * Requires a stage reference, so it can be passed to each instanced entity.
     */
    var World = (function () {
        /**
         * Create a world instance with some world options.
         */
        function World(options) {
            /** Collection of entity instances. */
            this.entities = {};
            this.stage = options.stage;
            this.game = options.game;
        }
        /**
         * Loop over each entity.
         */
        World.prototype.loopOverEntities = function (looper) {
            for (var _i = 0, _a = Object.keys(this.entities); _i < _a.length; _i++) {
                var tag = _a[_i];
                var entity = this.entities[tag];
                // Don't loop over null entities (which are currently loading).
                if (entity)
                    looper(entity, tag);
            }
        };
        /**
         * Synchronize the world with the provided game state data.
         *   - Add new state entities to the world (load them dynamically).
         *   - Remove extraneous state entities from the world.
         *   - Return a report of all added or removed entities.
         */
        World.prototype.conform = function (gameState) {
            var _this = this;
            var added = [];
            var removed = [];
            // Add entities that are present in the game state, but are missing from this world.
            gameState.loopOverEntities(function (entityState, tag) {
                if (!_this.entities.hasOwnProperty(tag))
                    added.push(_this.addEntity(tag, entityState).then(function () { return undefined; }));
            });
            // Remove entities that are missing from the game state, but are present in this game world.
            gameState.loopOverEntities(function (entityState, tag) {
                if (!gameState.getEntity(tag))
                    removed.push(_this.removeEntity(tag).then(function () { return tag; }));
            });
            // Return a report of all added or removed entities.
            return Promise.all([Promise.all(added), Promise.all(removed)]).then(function (results) { return ({
                added: results[0],
                removed: results[1]
            }); });
        };
        /**
         * Load, instance, and add an entity to the game world based on provided entity state.
         */
        World.prototype.addEntity = function (tag, state) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                // Entity is set to null in the collection while the entity is loading.
                // If we didn't do this, the world might perform another sync during
                _this.entities[tag] = null;
                // Load the entity.
                require([state.type], function (entityModule) {
                    // Instance the entity.
                    var entity = new entityModule.default({
                        stage: _this.stage,
                        game: _this.game,
                        tag: tag,
                        label: state.label
                    });
                    // Add the entity to the entities collection.
                    _this.entities[tag] = entity;
                    // Log about it.
                    _this.game.log("(+) Added entity " + entity);
                    // Resolve the promise with the added entity.
                    resolve(entity);
                }, 
                // Handle loading error by rejecting the promise.
                function (error) { reject(error); });
            });
        };
        /**
         * Remove an entity from the game world.
         */
        World.prototype.removeEntity = function (tag) {
            var entity = this.entities[tag];
            entity.removal();
            delete this.entities[tag];
            this.game.log("(-) Removed entity " + entity);
            return Promise.resolve();
        };
        return World;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = World;
});
//# sourceMappingURL=World.js.map