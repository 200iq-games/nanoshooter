var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Engine/Game", "./Engine/Entity"], function (require, exports, Game_1, Entity_1) {
    "use strict";
    /**
     * Create some kind of demo scene, which is apparently supposed to be some kind of early version of Nanoshooter..
     */
    var Nanoshooter = (function (_super) {
        __extends(Nanoshooter, _super);
        function Nanoshooter() {
            _super.apply(this, arguments);
        }
        Nanoshooter.prototype.initialize = function (stage) {
            _super.prototype.initialize.call(this, stage);
            var canvas = stage.canvas, scene = stage.scene;
            // Physics.
            var gravity = new BABYLON.Vector3(0, -9.81, 0);
            scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());
            // Background color.
            scene.clearColor = new BABYLON.Color3(0.8, 0.8, 0.8);
            // Lights.
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 20, 0), scene);
            light.intensity = 0.8;
            // Camera.
            var camera = new BABYLON.UniversalCamera("camera1", new BABYLON.Vector3(0, 40, -2), scene);
            camera.setTarget(BABYLON.Vector3.Zero());
            camera.attachControl(canvas, false);
            // Action!
            this.createInitialEntities();
        };
        Nanoshooter.prototype.createInitialEntities = function () {
            // Floor.
            this.addEntity(new Entity_1.EntityState({
                type: "Nanoshooter/Entities/Floor",
                label: "FancyFloor"
            }));
            // Spawner.
            this.addEntity(new Entity_1.EntityState({
                type: "Nanoshooter/Entities/Spawner",
                label: "Spawnlord"
            }));
            // Robot.
            this.addEntity(new Entity_1.EntityState({
                type: "Nanoshooter/Entities/Robot",
                label: "Robot"
            }));
            // // Cube.
            // this.addEntity(new EntityState({
            //     type: "Nanoshooter/Entities/Cube",
            //     label: "FancyCube"
            // }))
        };
        return Nanoshooter;
    }(Game_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Nanoshooter;
});
//# sourceMappingURL=Nanoshooter.js.map