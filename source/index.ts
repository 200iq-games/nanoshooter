
import {Game} from "monarch-engine/dist/game"
import {Entity} from "monarch-engine/dist/entity"
import {ModeOfConduct} from "monarch-engine/dist/interfaces"
import {Cube, CubeEntry} from "monarch-engine/dist/common/entities/cube"
import {Agent, AgentEntry} from "monarch-engine/dist/common/entities/agent"
import {Editor, EditorEntry} from "monarch-engine/dist/common/entities/editor"
import {Terrain, TerrainEntry} from "monarch-engine/dist/common/entities/terrain"
import {Director, DirectorEntry} from "monarch-engine/dist/common/entities/director"
import {Spectator, SpectatorEntry} from "monarch-engine/dist/common/entities/spectator"
import {Environment, EnvironmentEntry} from "monarch-engine/dist/common/entities/environment"

const game = new Game({
	mode: ModeOfConduct.Alone,
	canvas: document.querySelector("canvas"),
	overlay: document.querySelector(".overlay"),
	entityClasses: {
		Cube,
		Agent,
		Terrain,
		Editor,
		Director,
		Spectator,
		Environment
	}
})

game.manager.addEntry<TerrainEntry>({
	type: "Terrain",
	worldmongerPath: "assets/worldmonger"
})

game.manager.addEntry<DirectorEntry>({
	type: "Director"
})

game.manager.addEntry<EditorEntry>({
	type: "Editor",
	bearings: {
		position: [0, 25, -5],
		rotation: [0, 0, 0, 0]
	}
})
