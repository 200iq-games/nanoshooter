
import Nanoshooter from "./Nanoshooter";

// Instance Nanoshooter.
const nanoshooter = new Nanoshooter(document.body);

// Attach nanoshooter to the global window object for easy debugging.
(<any>window).nanoshooter = nanoshooter;

// Log game startup time.
console.debug(`Game took ${nanoshooter.startupDuration.toFixed(0)}ms to initialize.`);
