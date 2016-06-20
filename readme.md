
# Nanoshooter – [![Build Status](https://travis-ci.org/ChaseMoskal/Nanoshooter.svg?branch=master)](https://travis-ci.org/ChaseMoskal/Nanoshooter) – [***PLAY NOW!***](http://chasemoskal.github.io/Nanoshooter/)

## Start tinkering!

  1. Clone this repo.

  2. Run these commands first, and again every time you pull down new changes *(after every `git pull`):*

    1. `npm install` – Install all project dependencies (locally).

    2. `npm run build` – Build all of the project's TypeScript source code.

  3. Run the dev server so you can launch the game locally *(do this whenever you start working):*

    1. `npm run server` – Start running the project's internal web server. Hit `CTRL-C` when you want to stop the server process.

    2. Visit [http://localhost:8080/](http://localhost:8080/) to launch the game. I put this dev server on port 8080 because port 80 was giving Lonnie issues (probably firewall related). You can change this port in the `package.json` *(try not to commit it though).*

## Dev notes

  - For editing code, open the project directory in [Visual Studio Code](https://code.visualstudio.com/).

    - When you install VS Code, you'll definitely want to enable that *Open Code from Right-click Context Menu* option that the installer has.

    - Hit `CTRL-SHIFT-B` to run the build in VS Code.

  - If you're on Windows, you'll probably want to use [Cmder](http://cmder.net/) as your command-line interface.

    - Also, follow [these cryptic instructions](https://github.com/cmderdev/cmder/wiki/%5BWindows%5D-%22Open-Cmder-Here%22-in-context-menu) to gain the lovely ability to *Open Cmder Here* into any folder from the right-click context menu.

  - `npm run watch` – Start a compile-on-save process, which will rebuild TypeScript files on the fly as you save changes.

    - You might want to run this watch process in a separate Cmder tab (`CTRL-T` for new tab).

  - All 3D asset filenames must be lowercase – files such as `*.blend`, `*.obj`, `*.mtl` – at least for now, as it seems to be some weird bug or limitation with the Babylon loaders.

  - [Travis CI will build each commit](https://travis-ci.org/ChaseMoskal/Nanoshooter), and email me when you break the build :P

  - Later on, loading performance will be optimized via Almond module bundling.

## Art viewer mode for previewing any OBJ file

You can preview individual art assets in the game engine, by simply adding their path to the URL after a question mark. This feature, the "Art Viewer" allows you to view any `.obj` file in-game without the need to code up a new corresponding Entity in TypeScript.

So, if the game's link is normally this *(it'll be 'localhost' if you're working locally):*
  - http://chasemoskal.github.io/Nanoshooter/

Activate the Art Viewer by adding a question mark followed by the `.obj` file path:
  - [http://chasemoskal.github.io/Nanoshooter/**?art/tanks/alpha/tank-alpha.obj**](http://chasemoskal.github.io/Nanoshooter/?art/tanks/alpha/tank-alpha.obj)
  - [http://chasemoskal.github.io/Nanoshooter/**?art/tanks/bravo/tank-bravo.obj**](http://chasemoskal.github.io/Nanoshooter/?art/tanks/bravo/tank-bravo.obj)

For now at least, only `.obj` files will be loaded. If the file isn't found, or there's an error loading the file, nothing will appear, and the error will be reported to the javascript developer console (F12). Interestingly, we've discovered that any full URL to a remotely hosted OBJ on the internet will load up fine.

The art viewer might be really handy while working on art assets in Blender. You can point the game at an `.obj` file to preview it, then tweak it in Blender, re-export the `.obj`, and then hit refresh in the browser to see results instantly. You can do this over and over again, no build step required.
