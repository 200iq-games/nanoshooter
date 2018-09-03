
import {
	Cube,
	Game,
	Editor,
	EditorEntry,
	ModeOfConduct
} from "monarch-engine"

// import {Agent} from "./entities/agent"
import {Terrain, TerrainEntry} from "./entities/terrain"
import {Director, DirectorEntry} from "./entities/director"

const game = new Game({
	mode: ModeOfConduct.Alone,
	canvas: document.querySelector("canvas"),
	overlayElement: document.querySelector(".overlay"),
	gravity: [0, -3.7, 0],
	entityClasses: {
		Cube,
		// Agent,
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
