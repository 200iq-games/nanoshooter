var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../Engine/Entity"], function (require, exports, Entity_1) {
    "use strict";
    /**
     * A simple cube object in the game world.
     */
    var Cube = (function (_super) {
        __extends(Cube, _super);
        function Cube() {
            _super.apply(this, arguments);
        }
        Cube.prototype.initialize = function () {
            var mesh = this.mesh = BABYLON.Mesh.CreateBox(this.tag, 1.5, this.stage.scene);
            mesh["cube"] = true;
            var material = new BABYLON.StandardMaterial("floor", this.stage.scene);
            material.diffuseColor = new BABYLON.Color3(0, 1, 0.0);
            material.specularPower = 0;
            mesh.material = material;
            mesh.position.y = 21.13;
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.2, restitution: 0.1 }, this.stage.scene);
        };
        Cube.prototype.removal = function () {
            this.mesh.dispose();
        };
        Cube.type = "Nanoshooter/Entities/Cube";
        return Cube;
    }(Entity_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Cube;
});
//# sourceMappingURL=Cube.js.map