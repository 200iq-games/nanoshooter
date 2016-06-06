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
    var Robot = (function (_super) {
        __extends(Robot, _super);
        function Robot() {
            _super.apply(this, arguments);
            this.movement = BABYLON.Vector3.Zero();
        }
        Robot.prototype.initialize = function () {
            var _this = this;
            // Keyboard listeners.
            {
                this.listeners = {
                    keydown: function (event) {
                        if (event.keyCode === 87)
                            _this.movement.z = 1;
                        else if (event.keyCode === 83)
                            _this.movement.z = -1;
                        else if (event.keyCode === 65)
                            _this.movement.x = -1;
                        else if (event.keyCode === 68)
                            _this.movement.x = 1;
                    },
                    keyup: function (event) {
                        if (event.keyCode === 87)
                            _this.movement.z = 0;
                        else if (event.keyCode === 83)
                            _this.movement.z = 0;
                        else if (event.keyCode === 65)
                            _this.movement.x = 0;
                        else if (event.keyCode === 68)
                            _this.movement.x = 0;
                    }
                };
                window.addEventListener("keydown", this.listeners.keydown);
                window.addEventListener("keyup", this.listeners.keyup);
            }
            // OBJ loading.
            {
                var assetsManager = new BABYLON.AssetsManager(this.stage.scene);
                var meshTask = assetsManager.addMeshTask("mesh", "", "./art/", "robot.obj");
                meshTask.onSuccess = function (task) {
                    _this.mesh = task.loadedMeshes[0];
                    _this.loaded();
                };
                assetsManager.useDefaultLoadingScreen = false;
                assetsManager.load();
            }
        };
        /**
         * Action taken after the robot mesh has loaded.
         */
        Robot.prototype.loaded = function () {
            // Move up a little, so it spawns above the floor.
            this.mesh.position.y += 2;
            // Physics imposter is just a box.
            this.mesh.physicsImpostor = new BABYLON.PhysicsImpostor(this.mesh, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.1, friction: 0.05 }, this.stage.scene);
        };
        /**
         * Game logic run every tick.
         */
        Robot.prototype.logic = function (state, tickInfo) {
            // Wait for the mesh to be loaded.
            if (this.mesh) {
                // When the mouse cursor is landing on something, and its not this robot mesh.
                if (this.stage.pick.hit && this.stage.pick.pickedMesh !== this.mesh && !this.stage.pick.pickedMesh["cube"]) {
                    // Rotate at the aim point, which is Y+1 above the actual picked point.
                    var aimPoint = this.stage.pick.pickedPoint.add(new BABYLON.Vector3(0, 1, 0));
                    this.mesh.lookAt(aimPoint, 0, 0, 0);
                }
                // Apply movement impulses.
                var t = tickInfo.timeSince / 20;
                var impulse = this.movement.multiply(new BABYLON.Vector3(t, t, t));
                this.mesh.applyImpulse(impulse, this.mesh.position);
            }
            return { stateDelta: {} };
        };
        Robot.prototype.removal = function () {
            {
                if (this.mesh)
                    this.mesh.dispose;
                this.mesh = null;
            }
            {
                window.removeEventListener("keydown", this.listeners.keydown);
                window.removeEventListener("keyup", this.listeners.keyup);
            }
        };
        Robot.type = "Nanoshooter/Entities/Robot";
        return Robot;
    }(Entity_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Robot;
});
//# sourceMappingURL=Robot.js.map