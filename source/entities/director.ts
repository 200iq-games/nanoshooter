
import {autorun} from "mobx"

import {
	Context,
	Entity,
	Watcher,
	StateEntry,
	Input
} from "monarch-engine"

export interface DirectorEntry extends StateEntry {
	type: "Director"
}

const bindings = {
	spawnPlayer: [Input.R],
	spawnNpc: [Input.F]
}

export class Director extends Entity<Context, DirectorEntry> {

	private readonly watcher = new Watcher<typeof bindings>({
		eventTarget: this.context.window,
		bindings
	})

	private npcs = []

	// private spawnPlayer(manager: Manager) {
	// 	manager.addEntry(<AgentEntry>{
	// 		type: "Agent",
	// 		player: true,
	// 		bearings: {
	// 			position: [0, 10, 0],
	// 			rotation: QuaternionZero
	// 		}
	// 	})
	// }

	private readonly reactions = [
		autorun(() => {
			const spawnPlayer = this.watcher.status.spawnPlayer
			if (spawnPlayer) {
				console.log("TODO SPAWN PLAYER")
				// const {manager} = this.context

				// const players = <Agent[]>manager.getEntities()
				// 	.filter(entity => entity instanceof Agent && entity.player)

				// if (players.length === 0) this.spawnPlayer(manager)
			}
		})
	]

	async destructor() {
		for (const dispose of this.reactions) dispose()
	}
}
