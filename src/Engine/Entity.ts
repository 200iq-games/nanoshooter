
import Stateful, {State} from "./Stateful";
import Game from "./Game";

export default class Entity extends Stateful {
    name: string;
    game: Game;
    id: string;

    state: EntityState = {
        health: 100
    };

    constructor(options: EntityOptions) {
        super();

        // Use provided name or default.
        this.name = (options.name !== undefined)
            ? options.name
            : "entity";
    }

    attach(game: Game, id: string) {
        this.game = game;
        this.id = id;
    }

    // Aesthetic appearance for debugging logs.
    toString() {
        return `<${this.name}${this.id?' id='+this.id:''}>`;
    }
}

export interface EntityOptions {
    name?: string;
}

export interface EntityState {
    health: number;
}
