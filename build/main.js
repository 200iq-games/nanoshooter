///<reference path="../deps/babylon/babylon.d.ts"/>
///<reference path="../typings/browser.d.ts"/>
define(["require", "exports", "./Nanoshooter"], function (require, exports, Nanoshooter_1) {
    "use strict";
    // This main script is the entry point for the web browser.
    //   - Instantiate and start the Nanoshooter game.
    //   - Log some timing/profiling information.
    //   - Start running the game.
    var timeBeforeInitialize = (+new Date);
    // Initialize the Nanoshooter game.
    var nanoshooter = window["nanoshooter"] = new Nanoshooter_1.default({
        log: function () {
            var messages = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                messages[_i - 0] = arguments[_i];
            }
            return console.log.apply(console, messages);
        },
        hostElement: document.querySelector(".game")
    });
    {
        var fps_1 = document.querySelector(".fps");
        setInterval(function () {
            fps_1.textContent = nanoshooter.getFramerate().toFixed(0);
        }, 100);
    }
    // Start running the game engine.
    nanoshooter.start();
    // Log the profiling results.
    var timeAfterInitialize = (+new Date);
    var loadTime = (timeBeforeInitialize - performance.timing.navigationStart).toFixed(0);
    var initializeTime = (timeAfterInitialize - timeBeforeInitialize).toFixed(0);
    console.debug("(\u2192) Page load " + loadTime + " ms / Game initialization " + initializeTime + " ms");
});
//# sourceMappingURL=main.js.map