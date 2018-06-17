
import {Game, ModeOfConduct} from "monarch-engine"
import {Cube} from "monarch-engine/dist/common/entities/cube"
import {Editor, EditorEntry} from "monarch-engine/dist/common/entities/editor"

import {Agent} from "./entities/agent"
import {Terrain, TerrainEntry} from "./entities/terrain"
import {Director, DirectorEntry} from "./entities/director"

const game = new Game({
	mode: ModeOfConduct.Alone,
	canvas: document.querySelector("canvas"),
	overlay: document.querySelector(".overlay"),
	gravity: 3.7,
	entityClasses: {
		Cube,
		Agent,
		Terrain,
		Editor,
		Director
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
