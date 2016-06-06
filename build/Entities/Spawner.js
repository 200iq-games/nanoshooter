var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../Engine/Entity"], function (require, exports, Entity_1) {
    "use strict";
    /**
     * Spawns stuff.
     */
    var Spawner = (function (_super) {
        __extends(Spawner, _super);
        function Spawner() {
            _super.apply(this, arguments);
        }
        Spawner.prototype.initialize = function () {
            var _this = this;
            window.addEventListener("keyup", this.keyupAction = function (event) {
                //                  Spacebar.
                //                     ↓
                if (event.keyCode === 32) {
                    _this.game.addEntity(new Entity_1.EntityState({
                        type: "Nanoshooter/Entities/Cube",
                        label: "SpawnedCube"
                    }));
                }
            });
        };
        Spawner.prototype.removal = function () {
            window.removeEventListener("keyup", this.keyupAction);
        };
        Spawner.type = "Nanoshooter/Entities/Spawner";
        return Spawner;
    }(Entity_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Spawner;
});
//# sourceMappingURL=Spawner.js.map