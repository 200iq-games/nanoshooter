
/*

based on worldmonger: https://github.com/BabylonJS/Website/tree/master/Scenes/WorldMonger
by david catuhe (deltakosh)
apache license 2.0
modified by chase moskal

*/

import * as BABYLON from "babylonjs"

const paths = {
	ground: "assets/worldmonger/shaders/ground",
	water: "assets/worldmonger/shaders/water",
	terrain: "assets/terrain"
}

export class GroundMaterial extends BABYLON.Material {
	scene
	_cachedDefines

	light
	groundTexture
	grassTexture
	snowTexture
	rockTexture
	sandTexture
	blendTexture
	sandLimit = 1
	rockLimit = 5
	snowLimit = 8

	constructor(name, scene, light) {
		super(name, scene)
		this.scene = scene

		BABYLON.Engine.ShadersRepository = `./`

		BABYLON.Material.call(this, name, scene)
		this.light = light

		this.groundTexture = new BABYLON.Texture(`${paths.ground}/ground.jpg`, scene)
		this.groundTexture.uScale = 6.0
		this.groundTexture.vScale = 6.0

		this.grassTexture = new BABYLON.Texture(`${paths.terrain}/dirt-01-diffuse.jpg`, scene)
		this.grassTexture.uScale = 6.0
		this.grassTexture.vScale = 6.0

		this.snowTexture = new BABYLON.Texture(`${paths.ground}/snow.jpg`, scene)
		this.snowTexture.uScale = 20.0
		this.snowTexture.vScale = 20.0

		this.sandTexture = new BABYLON.Texture(`${paths.ground}/sand.jpg`, scene)
		this.sandTexture.uScale = 4.0
		this.sandTexture.vScale = 4.0

		this.rockTexture = new BABYLON.Texture(`${paths.ground}/rock.jpg`, scene)
		this.rockTexture.uScale = 15.0
		this.rockTexture.vScale = 15.0

		this.blendTexture = new BABYLON.Texture(`${paths.ground}/blend.png`, scene)
		this.blendTexture.uOffset = Math.random()
		this.blendTexture.vOffset = Math.random()
		this.blendTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE
		this.blendTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE
	}

	needAlphaBlending() { return false }
	needAlphaTesting() { return false }

	isReady(mesh) {
		const engine: BABYLON.Engine = this.scene.getEngine()

		if (!this.groundTexture.isReady)
			return false
		if (!this.snowTexture.isReady)
			return false
		if (!this.sandTexture.isReady)
			return false
		if (!this.rockTexture.isReady)
			return false
		if (!this.grassTexture.isReady)
			return false

		const defines = []
		if (this.scene.clipPlane) {
			defines.push("#define CLIPPLANE")
		}

		const join = defines.join("\n")
		if (this._cachedDefines !== join) {
			this._cachedDefines = join

			this._effect = engine.createEffect(`${paths.ground}/ground`,
				["position", "normal", "uv"],
				["worldViewProjection", "groundMatrix", "sandMatrix", "rockMatrix", "snowMatrix", "grassMatrix", "blendMatrix", "world", "vLightPosition", "vLimits", "vClipPlane"],
				["groundSampler", "sandSampler", "rockSampler", "snowSampler", "grassSampler", "blendSampler"],
				join)
		}

		if (!this._effect.isReady()) {
			return false
		}

		return true
	}

	bind(world, mesh) {
		this._effect.setMatrix("world", world)
		this._effect.setMatrix("worldViewProjection", world.multiply(this.scene.getTransformMatrix()))
		this._effect.setVector3("vLightPosition", this.light.position)

		if (this.groundTexture) {
			this._effect.setTexture("groundSampler", this.groundTexture)
			this._effect.setMatrix("groundMatrix", this.groundTexture.getTextureMatrix())
		}

		if (this.sandTexture) {
			this._effect.setTexture("sandSampler", this.sandTexture)
			this._effect.setMatrix("sandMatrix", this.sandTexture.getTextureMatrix())
		}

		if (this.rockTexture) {
			this._effect.setTexture("rockSampler", this.rockTexture)
			this._effect.setMatrix("rockMatrix", this.rockTexture.getTextureMatrix())
		}

		if (this.snowTexture) {
			this._effect.setTexture("snowSampler", this.snowTexture)
			this._effect.setMatrix("snowMatrix", this.snowTexture.getTextureMatrix())
		}

		if (this.grassTexture) {
			this._effect.setTexture("grassSampler", this.grassTexture)
			this._effect.setMatrix("grassMatrix", this.grassTexture.getTextureMatrix())
		}

		if (this.blendTexture) {
			this._effect.setTexture("blendSampler", this.blendTexture)
			this._effect.setMatrix("blendMatrix", this.blendTexture.getTextureMatrix())
		}

		this._effect.setFloat3("vLimits", this.sandLimit, this.rockLimit, this.snowLimit)

		if (this.scene.clipPlane) {
			const clipPlane = this.scene.clipPlane
			this._effect.setFloat4("vClipPlane", clipPlane.normal.x, clipPlane.normal.y, clipPlane.normal.z, clipPlane.d)
		}
	}

	dispose() {
		if (this.grassTexture) {
			this.grassTexture.dispose()
		}

		if (this.groundTexture) {
			this.groundTexture.dispose()
		}

		if (this.snowTexture) {
			this.snowTexture.dispose()
		}

		if (this.sandTexture) {
			this.sandTexture.dispose()
		}

		if (this.rockTexture) {
			this.rockTexture.dispose()
		}

		super.dispose()
	}
}

export class WaterMaterial extends BABYLON.Material {
	scene
	light
	bumpTexture
	reflectionTexture
	refractionTexture
	waterColor
	waterColorLevel
	fresnelLevel
	reflectionLevel
	refractionLevel
	waveLength
	waveHeight
	waterDirection
	private _time

	constructor(name, scene, light) {
		super(name, scene)
		this.scene = scene
		this.light = light

		BABYLON.Engine.ShadersRepository = `./`

		this.bumpTexture = new BABYLON.Texture(`${paths.water}/bump.png`, scene)
		this.bumpTexture.uScale = 2
		this.bumpTexture.vScale = 2
		this.bumpTexture.wrapU = BABYLON.Texture.MIRROR_ADDRESSMODE
		this.bumpTexture.wrapV = BABYLON.Texture.MIRROR_ADDRESSMODE

		this.reflectionTexture = new BABYLON.MirrorTexture("reflection", 512, scene, true)
		this.refractionTexture = new BABYLON.RenderTargetTexture("refraction", 512, scene, true)
		this.reflectionTexture.mirrorPlane = new BABYLON.Plane(0, -1, 0, 0)

		this.refractionTexture.onBeforeRender = () => {
			this.scene.clipPlane = new BABYLON.Plane(0, 1, 0, 0)
		}

		this.refractionTexture.onAfterRender = () => {
			this.scene.clipPlane = null
		}

		this.waterColor = new BABYLON.Color3(0.0, 0.3, 0.1)
		this.waterColorLevel = 0.2
		this.fresnelLevel = 1.0
		this.reflectionLevel = 0.6
		this.refractionLevel = 0.8

		this.waveLength = 0.1
		this.waveHeight = 0.15

		this.waterDirection = new BABYLON.Vector2(0, 1.0)

		this._time = 0
	}

	needAlphaBlending() { return false }
	needAlphaTesting() { return false }

	getRenderTargetTextures = (): any => {
		const results = []
		results.push(this.reflectionTexture)
		results.push(this.refractionTexture)
		return results
	}

	isReady(mesh) {
		const engine = this.scene.getEngine()

		if (this.bumpTexture && !this.bumpTexture.isReady) {
			return false
		}

		this._effect = engine.createEffect(`${paths.water}/water`,
			["position", "normal", "uv"],
			["worldViewProjection", "world", "view", "vLightPosition", "vEyePosition", "waterColor", "vLevels", "waveData", "windMatrix"],
			["reflectionSampler", "refractionSampler", "bumpSampler"],
			"")

		if (!this._effect.isReady()) {
			return false
		}

		return true
	}

	bind(world, mesh) {
		this._time += 0.0001 * this.scene.getAnimationRatio()

		this._effect.setMatrix("world", world)
		this._effect.setMatrix("worldViewProjection", world.multiply(this.scene.getTransformMatrix()))
		this._effect.setVector3("vEyePosition", this.scene.activeCamera.position)
		this._effect.setVector3("vLightPosition", this.light.position)
		this._effect.setColor3("waterColor", this.waterColor)
		this._effect.setFloat4("vLevels", this.waterColorLevel, this.fresnelLevel, this.reflectionLevel, this.refractionLevel)
		this._effect.setFloat2("waveData", this.waveLength, this.waveHeight)

		// Textures
		this._effect.setMatrix("windMatrix", this.bumpTexture.getTextureMatrix().multiply(BABYLON.Matrix.Translation(this.waterDirection.x * this._time, this.waterDirection.y * this._time, 0)))
		this._effect.setTexture("bumpSampler", this.bumpTexture)
		this._effect.setTexture("reflectionSampler", this.reflectionTexture)
		this._effect.setTexture("refractionSampler", this.refractionTexture)
	}

	dispose() {
		if (this.bumpTexture) {
			this.bumpTexture.dispose()
		}

		if (this.reflectionTexture) {
			this.reflectionTexture.dispose()
		}

		if (this.refractionTexture) {
			this.refractionTexture.dispose()
		}

		super.dispose()
	}
}
