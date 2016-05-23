
///<reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts"/>
///<reference path="../typings/browser.d.ts"/>

import Nanoshooter from "./Nanoshooter";
import Entity from "./Engine/Entity";
const log = (...messages: any[]) => console.debug.apply(console, messages);

// Instance the Nanoshooter game.
const nanoshooter = new Nanoshooter({
    host: document.body,
    log
});

// Attach our first entity.
const entity = new Entity({ name: "test-entity" });
nanoshooter.attach(entity);

// Attach nanoshooter to the global window object for easy debugging.
(<any>window).nanoshooter = nanoshooter;
