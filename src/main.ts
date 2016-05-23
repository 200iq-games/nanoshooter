
import Nanoshooter from "./Nanoshooter";
import State from "./State";
import Entity from "./Entity";

// Log function for emitting debug information to the JS console.
const log = (...messages: any[]) => console.debug.apply(console, messages);

// Create an empty game state.
const state = new State();
const entity = new Entity({ name: "test-entity" });
state.attach(entity);

// Instance the Nanoshooter game.
const nanoshooter = new Nanoshooter({
    host: document.body,
    state,
    log
});

// Attach nanoshooter to the global window object for easy debugging.
(<any>window).nanoshooter = nanoshooter;
