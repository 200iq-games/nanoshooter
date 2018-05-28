
import {reaction, autorun} from "mobx"
import {
	Mesh,
	Scene,
	Space,
	Color3,
	Vector3,
	Quaternion,
	InstancedMesh,
	PhysicsImpostor,
	StandardMaterial
} from "babylonjs"
import {Vec3, RaycastVehicle, WheelInfo, IWheelInfoOptions, Cylinder, Body} from "cannon"
import * as cannon from "cannon"

import {Context} from "monarch-engine/dist/game"
import {Entity} from "monarch-engine/dist/entity"
import {Watcher, Input} from "monarch-engine/dist/watcher"
import {loadBabylonMeshes} from "monarch-engine/dist/toolbox"
import {Vector, Bearings, VectorZero} from "monarch-engine/dist/interfaces"
import {makeActiveCamera, createRoundCameraRig} from "monarch-engine/dist/common/tools/camtools"

import {Editor} from "monarch-engine/dist/common/entities/editor"

export interface AgentEntry {
	type: "Agent"
	player: boolean
	bearings: Bearings
}

export interface AgentAssets {
	allMeshes: Mesh[]
	tankPhysicsBodyBase: Mesh
	tankBodyBase: Mesh
	tankTurretBase: Mesh
	tankCannonBase: Mesh
	tankWheelBase: Mesh
	tankGasBase: Mesh
}

export interface TankMeshes {
	tankPhysicsBody: InstancedMesh
	tankBody: InstancedMesh
	tankTurret: InstancedMesh
	tankCannon: InstancedMesh
	tankGas: InstancedMesh
	tankWheel1: InstancedMesh
	tankWheel2: InstancedMesh
	tankWheel3: InstancedMesh
	tankWheel4: InstancedMesh
	tankWheel5: InstancedMesh
	tankWheel6: InstancedMesh
}

export class Agent extends Entity<Context, AgentEntry> {

	private static assets: AgentAssets

	private meshes: Promise<TankMeshes> = (async () => {
		if (!Agent.assets) Agent.assets = await this.loadAssets()
		const meshes = await this.instanceAssets()
		this.setupVehiclePhysics(meshes)
		return meshes
	})()

	private vehicle: RaycastVehicle

	private async loadAssets() {
		const {scene} = this.context
		const meshes = <Mesh[]>(await loadBabylonMeshes(scene, "assets/tank/tank.babylon")).meshes
		for (const mesh of meshes) {
			mesh.isVisible = false
			mesh.convertToFlatShadedMesh()
		}
		return {
			allMeshes: meshes,
			tankPhysicsBodyBase: meshes.find(mesh => mesh.name === "tank-physics-body"),
			tankBodyBase: meshes.find(mesh => mesh.name === "tankbody"),
			tankTurretBase: meshes.find(mesh => mesh.name === "tankturret"),
			tankCannonBase: meshes.find(mesh => mesh.name === "tankcannon"),
			tankGasBase: meshes.find(mesh => mesh.name === "gastank"),
			tankWheelBase: meshes.find(mesh => mesh.name === "wheel-1")
		}
	}

	private async instanceAssets() {
		const {assets} = Agent
		return {
			tankPhysicsBody: assets.tankPhysicsBodyBase.createInstance("tank-physics-body-instance"),
			tankBody: assets.tankBodyBase.createInstance("tank-body-instance"),
			tankTurret: assets.tankTurretBase.createInstance("tank-turret-instance"),
			tankCannon: assets.tankCannonBase.createInstance("tank-cannon-instance"),
			tankGas: assets.tankGasBase.createInstance("tank-gas-instance"),
			tankWheel1: assets.tankWheelBase.createInstance("tank-wheel-instance-1"),
			tankWheel2: assets.tankWheelBase.createInstance("tank-wheel-instance-2"),
			tankWheel3: assets.tankWheelBase.createInstance("tank-wheel-instance-3"),
			tankWheel4: assets.tankWheelBase.createInstance("tank-wheel-instance-4"),
			tankWheel5: assets.tankWheelBase.createInstance("tank-wheel-instance-5"),
			tankWheel6: assets.tankWheelBase.createInstance("tank-wheel-instance-6")
		}
	}

	private async setupVehiclePhysics(meshes: TankMeshes) {
		const {
			tankPhysicsBody,
			tankBody,
			tankTurret,
			tankCannon,
			tankGas,
			tankWheel1,
			tankWheel2,
			tankWheel3,
			tankWheel4,
			tankWheel5,
			tankWheel6
		} = meshes

		// prepare the physics body
		tankPhysicsBody.isVisible = false
		tankPhysicsBody.physicsImpostor = new PhysicsImpostor(tankPhysicsBody, PhysicsImpostor.BoxImpostor, {mass: 500})

		// parent tank parts to the physics body
		this.camera.parent = tankPhysicsBody
		for (const m of [
			tankBody,
			tankTurret,
			tankCannon,
			tankGas
		]) {
			const p = m.getAbsolutePosition()
			m.parent = tankPhysicsBody
			m.setAbsolutePosition(p)
		}

		const {position} = this.entry.bearings
		tankPhysicsBody.setAbsolutePosition(Vector3.FromArray(position))

		const wheelMeshes = [
			tankWheel1,
			tankWheel2,
			tankWheel3,
			tankWheel4,
			tankWheel5,
			tankWheel6
		]

		const hiddenWheels = [tankWheel5, tankWheel6]
		for (const wheel of hiddenWheels) wheel.isVisible = false

		const {scene, physicsWorld} = this.context

		const wheelInfo: IWheelInfoOptions = {
			radius: 0.5,
			directionLocal: new Vec3(0, -1, 0),
			suspensionStiffness: 30,
			suspensionRestLength: 0.3,
			frictionSlip: 5,
			dampingRelaxation: 2.3,
			dampingCompression: 4.4,
			maxSuspensionForce: 100000,
			rollInfluence: 0.01,
			axleLocal: new Vec3(1, 0, 0),
			maxSuspensionTravel: 1,
			customSlidingRotationalSpeed: -30,
			useCustomSlidingRotationalSpeed: true,
			chassisConnectionPointLocal: new Vec3(1, 1, 0)
		}

		const wheelHeight = 1.2

		const wheelPositions = [
			new Vec3(-1, -wheelHeight, 2),
			new Vec3(1, -wheelHeight, 2),
			new Vec3(-1, -wheelHeight, -2),
			new Vec3(1, -wheelHeight, -2)
			// new Vec3(-1, -wheelHeight, -1.6),
			// new Vec3(1, -wheelHeight, -1.6),
		]

		// vehicle simulation
		const vehicle = new RaycastVehicle({
			chassisBody: tankPhysicsBody.physicsImpostor.physicsBody,
			indexRightAxis: 0,
			indexUpAxis: 1
		})

		// add wheels
		for (const chassisConnectionPointLocal of wheelPositions)
			vehicle.addWheel({...wheelInfo, chassisConnectionPointLocal})

		// add vehicle to physics world
		vehicle.addToWorld(physicsWorld)

		// type WheelOptions = {
		// 	radius: number
		// 	width: number
		// }

		// const getWheelQuaternion = (): cannon.Quaternion => {
		// 	const quaternion = new cannon.Quaternion()
		// 	quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2)
		// 	return quaternion
		// }

		// function createWheelMesh({radius, width, scene}: WheelOptions & {scene: Scene}): Mesh {
		// 	const name = "debugwheel"
		// 	const height = width
		// 	const diameterTop = radius * 2
		// 	const diameterBottom = diameterTop
		// 	const tesselation = 8
		// 	const subdivisions = 1
		// 	const mesh = Mesh.CreateCylinder(name, height, diameterTop, diameterBottom, tesselation, subdivisions, scene)
		// 	const q = getWheelQuaternion()
		// 	const quaternion = Quaternion.FromArray([q.x, q.y, q.z, q.w])
		// 	mesh.rotationQuaternion = quaternion
		// 	return mesh
		// }

		// function createWheelBody({radius, width}: WheelOptions): Body {
		// 	const radiusTop = radius
		// 	const radiusBottom = radiusTop
		// 	const height = width
		// 	const numSegments = 24
		// 	const cylinder = new cannon.Cylinder(radiusTop, radiusBottom, height, numSegments)

		// 	const body = new cannon.Body({mass: 0})
		// 	body.type = cannon.Body.KINEMATIC
		// 	body.collisionFilterGroup = 0 // turn off collisions

		// 	const quaternion = getWheelQuaternion()
		// 	body.addShape(cylinder, new Vec3(), quaternion)
		// }

		// create wheel bodies
		const wheelBodies = vehicle.wheelInfos.map(({radius}) => {
			const cylinder = new Cylinder(radius, radius, radius / 2, 10)
			const body = new Body({mass: 0})
			body.type = Body.KINEMATIC
			body.collisionFilterGroup = 0 // turn off collisions
			const q = new cannon.Quaternion()
			q.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2)
			body.addShape(cylinder, new Vec3(), q)
			physicsWorld.addBody(body)
			return body
		})

		// listen for wheel position updates
		physicsWorld.addEventListener("postStep", () => {
			// this.camera.setTarget(new Vector3(0, 2, 0))
			vehicle.wheelInfos.forEach((info, index) => {
				vehicle.updateWheelTransform(index)
				const {position, quaternion} = (<any>info).worldTransform
				const wheelMesh = wheelMeshes[index]
				wheelMesh.setAbsolutePosition(Vector3.FromArray([position.x, position.y, position.z]))
				wheelMesh.rotationQuaternion = Quaternion.FromArray(quaternion)
			})
		})

		this.vehicle = vehicle
	}

	private readonly watcher = new Watcher({
		eventTarget: this.context.window,
		bindings: {
			suicide: [Input.R],
			forward: [Input.W],
			backward: [Input.S],
			left: [Input.A],
			right: [Input.D]
		}
	})

	private readonly camera = createRoundCameraRig({
		scene: this.context.scene,
		canvas: this.context.canvas,
		targetPosition: VectorZero,
		radius: 6,
		active: true
	})

	private readonly reactions = [
		reaction(() => this.watcher.status.suicide, suicide => {
			if (suicide) {
				console.log("agent suicide", this.id)
				this.context.manager.removeEntry(this.id)
			}
		}),
		autorun(async() => {
			const {forward, left, right, backward} = this.watcher.status
			const {vehicle} = this
			const force = 1000
			const trad = 1
			if (vehicle) {
				vehicle.setBrake(0, 0)
				vehicle.setBrake(0, 1)
				vehicle.setBrake(0, 2)
				vehicle.setBrake(0, 3)
				if (forward) {
					vehicle.applyEngineForce(-force, 2)
					vehicle.applyEngineForce(-force, 3)
				}
				else {
					vehicle.applyEngineForce(0, 2)
					vehicle.applyEngineForce(0, 3)
				}
				if (backward) {
					vehicle.setBrake(force * 10, 0)
					vehicle.setBrake(force * 10, 1)
					vehicle.setBrake(force * 10, 2)
					vehicle.setBrake(force * 10, 3)
				}
				let steer = 0
				if (left) steer -= trad
				if (right) steer += trad
				vehicle.setSteeringValue(steer, 0)
				vehicle.setSteeringValue(steer, 1)
			}
		})
	]

	private readonly greeting = (() => {
		console.log("agent spawn", this.id)
		return true
	})()

	readonly player = this.entry.player

	async destructor() {
		for (const dispose of this.reactions) dispose()

		const editor = <Editor>this.context.manager.getEntities().find(entity => entity instanceof Editor)
		this.context.scene.activeCamera = editor.camera

		this.camera.dispose()

		const meshes = await this.meshes
		for (const meshName of Object.keys(meshes)) {
			const mesh = meshes[meshName]
			mesh.dispose()
		}
	}
}
