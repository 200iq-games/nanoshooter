
import * as babylon from "babylonjs"
import {Context, Entity, StateEntry} from "monarch-engine"

import {GroundMaterial, WaterMaterial} from "../tools/materials"

export interface TerrainEntry extends StateEntry {
	type: "Terrain"
	worldmongerPath: string
}

export class Terrain extends Entity<Context, TerrainEntry> {
	constructor(o) {
		super(o)
		const {entry} = this
		const {scene, canvas} = this.context
		this.makeTerrain(scene, entry)
	}

	private async makeTerrain(
		scene: babylon.Scene,
		entry: TerrainEntry
	) {
		const sun = new BABYLON.PointLight("Omni", new BABYLON.Vector3(20, 100, 2), scene)
		const {worldmongerPath} = entry

		// Skybox
		const skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, scene)
		const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene)
		skyboxMaterial.backFaceCulling = false
		skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(`${worldmongerPath}/skybox/skybox`, scene)
		skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE
		skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0)
		skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0)
		skyboxMaterial.disableLighting = true
		skybox.material = skyboxMaterial

		// Grounds
		const ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", `${worldmongerPath}/height-map.png`, 100, 100, 100, 0, 12, scene, true, mesh => {
			ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, {mass: 0})
		})
		const groundMaterial = new GroundMaterial("ground", scene, sun)
		ground.material = groundMaterial
		ground.position.y = -2.0

		const extraGround = BABYLON.Mesh.CreateGround("extraGround", 1000, 1000, 1, scene, false)
		const extraGroundMaterial = new BABYLON.StandardMaterial("extraGround", scene)
		extraGroundMaterial.diffuseTexture = new BABYLON.Texture(`${worldmongerPath}/shaders/ground/sand.jpg`, scene)
		; (<any>extraGroundMaterial.diffuseTexture).uScale = 60
		; (<any>extraGroundMaterial.diffuseTexture).vScale = 60
		extraGround.position.y = -2.05
		extraGround.material = extraGroundMaterial
		extraGround.physicsImpostor = new BABYLON.PhysicsImpostor(extraGround, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0})

		// Water
		const water = BABYLON.Mesh.CreateGround("water", 1000, 1000, 1, scene, false)
		const waterMaterial = new WaterMaterial("water", scene, sun)
		waterMaterial.refractionTexture.renderList.push(ground)
		waterMaterial.refractionTexture.renderList.push(extraGround)

		waterMaterial.reflectionTexture.renderList.push(ground)
		waterMaterial.reflectionTexture.renderList.push(skybox)

		water.isPickable = false
		water.material = waterMaterial
	}

	async destructor() {}
}
