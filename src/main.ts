
import Nanoshooter from "./Nanoshooter";
import State from "./State";
import Entity from "./Entity";

// Unique ID pulling station.
let nextId = 0;
const pullId = () => (++nextId).toString();

// Create the game state with a basic entity.
const state = new State();
const entity = new Entity({ id: pullId() });
state.add(entity);

// Instance the Nanoshooter game.
const nanoshooter = new Nanoshooter({

    // Game state to initialize with.
    state: state,

    // Where to place the canvas element.
    host: document.body,

    // How to handle debug logging messages.
    log: (...messages: any[]) => console.debug.apply(console, messages),
});

// Attach nanoshooter to the global window object for easy debugging.
(<any>window).nanoshooter = nanoshooter;
