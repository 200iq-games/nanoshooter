/*

based on worldmonger "elevationControl.js": https://github.com/BabylonJS/Website/blob/master/Scenes/WorldMonger/elevationControl.js
by david catuhe (deltakosh)
apache license 2.0
modified by chase moskal

*/

import * as BABYLON from "babylonjs"

export class ElevationControl {
	private _ground
	private _invertDirection = 1.0
	private _particleSystem
	radius = 5.0
	heightMin = 0
	heightMax = 11.0
	direction = 1

	constructor(ground) {
		this._ground = ground
		const scene = ground.getScene()
		this._particleSystem = this.prepareParticleSystem(scene)
	}

	private prepareParticleSystem(scene: BABYLON.Scene) {
		const particleSystem = new BABYLON.ParticleSystem("particles", 4000, scene)
		particleSystem.particleTexture = new BABYLON.Texture("assets/worldmonger/flare.png", scene)
		particleSystem.minAngularSpeed = -4.5
		particleSystem.maxAngularSpeed = 4.5
		particleSystem.minSize = 0.5
		particleSystem.maxSize = 4.0
		particleSystem.minLifeTime = 0.5
		particleSystem.maxLifeTime = 2.0
		particleSystem.minEmitPower = 0.5
		particleSystem.maxEmitPower = 1.0
		particleSystem.emitRate = 400
		particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE
		particleSystem.minEmitBox = new BABYLON.Vector3(0, 0, 0)
		particleSystem.maxEmitBox = new BABYLON.Vector3(0, 0, 0)
		particleSystem.direction1 = new BABYLON.Vector3(0, 1, 0)
		particleSystem.direction2 = new BABYLON.Vector3(0, 1, 0)
		particleSystem.color1 = new BABYLON.Color4(0, 0, 1, 1)
		particleSystem.color2 = new BABYLON.Color4(1, 1, 1, 1)
		particleSystem.gravity = new BABYLON.Vector3(0, 5, 0)
		particleSystem.manualEmitCount = 0
		particleSystem.emitter = new BABYLON.Vector3(0, 0, 0)
		particleSystem.start()
		return particleSystem
	}

	private _onBeforeRender
	private _onPointerDown
	private _onPointerUp
	private _onPointerMove
	private _onLostFocus

	attachControl(canvas: HTMLCanvasElement) {
		let currentPosition
		const that = this

		this._onBeforeRender = function () {
			if (!currentPosition)
				return

			const pickInfo = that._ground.getScene().pick(currentPosition.x, currentPosition.y)

			if (!pickInfo.hit)
				return
			if (pickInfo.pickedMesh !== that._ground)
				return

			that._particleSystem.emitter = pickInfo.pickedPoint.add(new BABYLON.Vector3(0, 3, 0))
			that._particleSystem.manualEmitCount += 400
			that._elevateFaces(pickInfo, that.radius, 0.2)
		}

		this._onPointerDown = function (evt) {
			evt.preventDefault()

			currentPosition = {
				x: evt.clientX,
				y: evt.clientY
			}
		}

		this._onPointerUp = function (evt) {
			evt.preventDefault()

			currentPosition = null
		}

		this._onPointerMove = function (evt) {
			evt.preventDefault()

			if (!currentPosition) {
				return
			}

			that._invertDirection = evt.button === 2 ? -1 : 1

			currentPosition = {
				x: evt.clientX,
				y: evt.clientY
			}
		}

		this._onLostFocus = function () {
			currentPosition = null
		}

		canvas.addEventListener("pointerdown", this._onPointerDown, true)
		canvas.addEventListener("pointerup", this._onPointerUp, true)
		canvas.addEventListener("pointerout", this._onPointerUp, true)
		canvas.addEventListener("pointermove", this._onPointerMove, true)
		window.addEventListener("blur", this._onLostFocus, true)

		this._ground.getScene().registerBeforeRender(this._onBeforeRender)
	}

	detachControl(canvas: HTMLCanvasElement) {
		canvas.removeEventListener("pointerdown", this._onPointerDown)
		canvas.removeEventListener("pointerup", this._onPointerUp)
		canvas.removeEventListener("pointerout", this._onPointerUp)
		canvas.removeEventListener("pointermove", this._onPointerMove)
		window.removeEventListener("blur", this._onLostFocus)
		this._ground.getScene().unregisterBeforeRender(this._onBeforeRender)
	}

	private _facesOfVertices
	private _groundVerticesPositions
	private _groundVerticesNormals
	private _groundIndices
	private _groundPositions
	private _groundFacesNormals

	private _prepareDataModelForElevation() {
		if (this._facesOfVertices === null) {
			this._facesOfVertices = []

			this._groundVerticesPositions = this._ground.getVerticesData(BABYLON.VertexBuffer.PositionKind)
			this._groundVerticesNormals = this._ground.getVerticesData(BABYLON.VertexBuffer.NormalKind)
			this._groundIndices = this._ground.getIndices()

			this._groundPositions = []
			let index
			for (index = 0; index < this._groundVerticesPositions.length; index += 3) {
				this._groundPositions.push(new BABYLON.Vector3(this._groundVerticesPositions[index], this._groundVerticesPositions[index + 1], this._groundVerticesPositions[index + 2]))
			}

			this._groundFacesNormals = []
			for (index = 0; index < this._ground.getTotalIndices() / 3; index++) {
				this._computeFaceNormal(index)
			}

			this._getFacesOfVertices()
		}
	}

	private _getFaceVerticesIndex(faceID) {
		return {
			v1: this._groundIndices[faceID * 3],
			v2: this._groundIndices[faceID * 3 + 1],
			v3: this._groundIndices[faceID * 3 + 2]
		}
	}

	private _computeFaceNormal(face) {
		const faceInfo = this._getFaceVerticesIndex(face)
		const v1v2 = this._groundPositions[faceInfo.v1].subtract(this._groundPositions[faceInfo.v2])
		const v3v2 = this._groundPositions[faceInfo.v3].subtract(this._groundPositions[faceInfo.v2])
		this._groundFacesNormals[face] = BABYLON.Vector3.Normalize(BABYLON.Vector3.Cross(v1v2, v3v2))
	}

	private _getFacesOfVertices = function () {
		this._facesOfVertices = []
		this._subdivisionsOfVertices = []
		let index

		for (index = 0; index < this._groundPositions.length; index++) {
			this._facesOfVertices[index] = []
			this._subdivisionsOfVertices[index] = []
		}

		for (index = 0; index < this._groundIndices.length; index++) {
			this._facesOfVertices[this._groundIndices[index]].push((index / 3) | 0)
		}

		for (let subIndex = 0; subIndex < this._ground.subMeshes.length; subIndex++) {
			const subMesh = this._ground.subMeshes[subIndex]
			for (index = subMesh.verticesStart; index < subMesh.verticesStart + subMesh.verticesCount; index++) {
				this._subdivisionsOfVertices[index].push(subMesh)
			}
		}
	}

	private _isBoxSphereIntersected(box, sphereCenter, sphereRadius) {
		const vector = BABYLON.Vector3.Clamp(sphereCenter, box.minimumWorld, box.maximumWorld)
		const num = BABYLON.Vector3.DistanceSquared(sphereCenter, vector)
		return (num <= (sphereRadius * sphereRadius))
	}

	private _selectedVertices

	private _elevateFaces(pickInfo, radius, height) {
		this._prepareDataModelForElevation()
		this._selectedVertices = []

		// Impact zone
		const sphereCenter = pickInfo.pickedPoint
		sphereCenter.y = 0
		let index

		// Determine list of vertices
		for (let subIndex = 0; subIndex < this._ground.subMeshes.length; subIndex++) {
			const subMesh = this._ground.subMeshes[subIndex]

			if (!this._isBoxSphereIntersected(subMesh.getBoundingInfo().boundingBox, sphereCenter, radius)) {
				continue
			}

			for (index = subMesh.verticesStart; index < subMesh.verticesStart + subMesh.verticesCount; index++) {
				const position = this._groundPositions[index]
				sphereCenter.y = position.y

				const distance = BABYLON.Vector3.Distance(position, sphereCenter)

				if (distance < radius) {
					this._selectedVertices[index] = distance
				}
			}
		}

		// Elevate vertices
		for (const selectedVertice of this._selectedVertices) {
			const position = this._groundPositions[selectedVertice]
			const distance = this._selectedVertices[selectedVertice]

			const fullHeight = height * this.direction * this._invertDirection
			if (distance < radius * 0.3) {
				position.y += fullHeight
			} else {
				position.y += fullHeight * (1.0 - (distance - radius * 0.3) / (radius * 0.7))
			}

			if (position.y > this.heightMax)
				position.y = this.heightMax
			else if (position.y < this.heightMin)
				position.y = this.heightMin

			this._groundVerticesPositions[selectedVertice * 3 + 1] = position.y
			this._updateSubdivisions(selectedVertice)
		}

		// Normals
		this._reComputeNormals()

		// Update vertex buffer
		this._ground.updateVerticesData(BABYLON.VertexBuffer.PositionKind, this._groundVerticesPositions)
		this._ground.updateVerticesData(BABYLON.VertexBuffer.NormalKind, this._groundVerticesNormals)
	}

	private _reComputeNormals = function() {
		const faces = []
		let face

		for (const selectedVertice of this._selectedVertices) {
			const faceOfVertices = this._facesOfVertices[selectedVertice]
			for (let index = 0; index < faceOfVertices.length; index++) {
				faces[faceOfVertices[index]] = true
			}
		}

		for (face in faces) {
			this._computeFaceNormal(face)
		}

		for (face in faces) {
			const faceInfo = this._getFaceVerticesIndex(face)
			this._computeNormal(faceInfo.v1)
			this._computeNormal(faceInfo.v2)
			this._computeNormal(faceInfo.v3)
		}
	}

	private _computeNormal = function(vertexIndex) {
		const faces = this._facesOfVertices[vertexIndex]

		let normal = BABYLON.Vector3.Zero()
		for (let index = 0; index < faces.length; index++) {
			normal = normal.add(this._groundFacesNormals[faces[index]])
		}

		normal = BABYLON.Vector3.Normalize(normal.scale(1.0 / faces.length))

		this._groundVerticesNormals[vertexIndex * 3] = normal.x
		this._groundVerticesNormals[vertexIndex * 3 + 1] = normal.y
		this._groundVerticesNormals[vertexIndex * 3 + 2] = normal.z
	}

	private _subdivisionsOfVertices

	private _updateSubdivisions(vertexIndex) {
		for (let index = 0; index < this._subdivisionsOfVertices[vertexIndex].length; index++) {
			const sub = this._subdivisionsOfVertices[vertexIndex][index]
			const boundingBox = sub.getBoundingInfo().boundingBox
			const boundingSphere = sub.getBoundingInfo().boundingSphere

			if (this._groundPositions[vertexIndex].y < boundingBox.minimum.y) {
				boundingSphere.radius += Math.abs(this._groundPositions[vertexIndex].y - boundingBox.minimum.y)
				boundingBox.minimum.y = this._groundPositions[vertexIndex].y
			} else if (this._groundPositions[vertexIndex].y > boundingBox.maximum.y) {
				boundingBox.maximum.y = this._groundPositions[vertexIndex].y
			}
		}

		const boundingBox = this._ground.getBoundingInfo().boundingBox
		const boundingSphere = this._ground.getBoundingInfo().boundingSphere
		if (this._groundPositions[vertexIndex].y < boundingBox.minimum.y) {
			boundingSphere.Radius += Math.abs(this._groundPositions[vertexIndex].y - boundingBox.minimum.y)
			boundingBox.minimum.y = this._groundPositions[vertexIndex].y
		} else if (this._groundPositions[vertexIndex].y > boundingBox.maximum.y) {
			boundingBox.maximum.y = this._groundPositions[vertexIndex].y
		}
	}
}
