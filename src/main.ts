
///<reference path="../bower_components/babylonjs/dist/babylon.2.3.d.ts"/>
///<reference path="../typings/browser.d.ts"/>

import Nanoshooter from "./Nanoshooter";
import Entity from "./Engine/Entity";

import {Logger} from "./Engine/Game";
const log: Logger = (...messages: any[]) => console.log.apply(console, messages);

import BroadcastLogger from "./Entities/BroadcastLogger";
import Broadcaster from "./Entities/Broadcaster";

//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Instance the Nanoshooter game.
const nanoshooter = new Nanoshooter({
    hostElement: document.body,
    log
});

// Entity that logs all broadcast messages.
const broadcastLogger = new BroadcastLogger({
    game: nanoshooter,
    id: nanoshooter.pullId()
});
(<any>window).broadcastLogger = broadcastLogger;

// Entity that broadcasts a message whenever spacebar is pressed.
const broadcaster = new Broadcaster({
    game: nanoshooter,
    id: nanoshooter.pullId()
});
(<any>window).broadcaster = broadcaster;

//------------------------------------------------------------------------
//------------------------------------------------------------------------

// Attach nanoshooter to the global window object for easy debugging.
(<any>window).nanoshooter = nanoshooter;
