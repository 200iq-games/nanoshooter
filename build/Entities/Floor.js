var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../Engine/Entity"], function (require, exports, Entity_1) {
    "use strict";
    /**
     * A floor object for the game world.
     */
    var Floor = (function (_super) {
        __extends(Floor, _super);
        function Floor() {
            _super.apply(this, arguments);
        }
        Floor.prototype.initialize = function () {
            var mesh = this.mesh = BABYLON.Mesh.CreateGround(this.tag, 128, 128, 2, this.stage.scene);
            var material = new BABYLON.StandardMaterial("floor", this.stage.scene);
            material.specularPower = 0;
            mesh.material = material;
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.1 }, this.stage.scene);
        };
        Floor.prototype.removal = function () {
            this.mesh.dispose();
        };
        Floor.type = "Nanoshooter/Entities/Floor";
        return Floor;
    }(Entity_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Floor;
});
//# sourceMappingURL=Floor.js.map