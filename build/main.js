define(["require", "exports", "./Nanoshooter"], function (require, exports, Nanoshooter_1) {
    "use strict";
    // Instance Nanoshooter.
    var nanoshooter = new Nanoshooter_1.default(document.body);
    // Attach nanoshooter to the global window object for easy debugging.
    window.nanoshooter = nanoshooter;
    // Log game startup time.
    console.debug("Game took " + nanoshooter.startupDuration.toFixed(0) + "ms to initialize.");
});
//# sourceMappingURL=main.js.map