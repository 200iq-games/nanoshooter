
import Nanoshooter from "./Nanoshooter";

// Instance Nanoshooter.
const nanoshooter = new Nanoshooter();

// Attach nanoshooter to the global window object for easy debugging.
(<any>window).nanoshooter = nanoshooter;
