
# Nanoshooter – [![Build Status](https://travis-ci.org/ChaseMoskal/Nanoshooter.svg?branch=master)](https://travis-ci.org/ChaseMoskal/Nanoshooter) – [***PLAY NOW!***](http://chasemoskal.github.io/Nanoshooter/)

*Open source game and framework, built on top of [BabylonJS](http://www.babylonjs.com/).*

## Hey, you there!

Are you an aspiring young programmer, eager to contribute to something open source *and* fun?

Or maybe you're an ambitious and fully-bearded artist, inspired to unleash your full creativity which the world has been waiting for?

Perhaps you have no skills whatsoever, and just want to feel like you're a part of something.

### *You've definitely come to the right place!*

**Nanoshooter is an open source project to create a free 3D online multiplayer action web game and framework – and we need volunteers like you!**

The primary goals of the Nanoshooter project are to:
  - Create a robust framework for building 3D online multiplayer action web games on [BabylonJS](https://github.com/BabylonJS/Babylon.js).
  - Make a neat tank game.

Eventually, the framework that is underneath the Nanoshooter game will move out into its own open source repository, and be given a legendary name. The primary goal of this releasing this framework, would be to contribute it as a platform for the BabylonJS community to build their own online multiplayer games with.

Nanoshooter is a revival of our old highschool project. This is familiar territory for us, as we're basically recreating the framework and gameplay functionality that we once had back in the Blender Game Engine — we want to bring this game to the same level of accomplishment, including collaborative online map editing — but this time we're doing it all right, at a professional caliber, and on the web.

**Interested to help out?** Well, apparently GitHub removed their private messaging feature, so shoot me a friendly email to the address that you'll find [on this page](https://chasemoskal.github.io/) *(anti-spam)*, and we'll chat about it.

As a team, we tend to chat via Skype or Mumble, but we ought to start using Gitter soon enough.

## Software you need

  - [**Git**](https://git-scm.com/) — version control, teamwork.

  - [**Node.js**](https://nodejs.org/en/) — development environment runtime.

  - **Code editor** — [Visual Studio Code](https://code.visualstudio.com/) is the editor of choice for this project. It's an open-source cross-platform full TypeScript IDE, and project is preconfigured for it.

      - When you install VSCode, you'll definitely want to enable that *Open Code from Right-click Context Menu* option that the installer has. Handy.

  - **Command-line utility**

    - *On Linux/Mac* — just use the Terminal that came with your system.

    - *On Windows* — install [Cmder](http://cmder.net/).

      - Also with Cmder, follow [these lame instructions](https://github.com/cmderdev/cmder/wiki/%5BWindows%5D-%22Open-Cmder-Here%22-in-context-menu) to gain the lovely ability to *Open Cmder Here* into any folder from the right-click context menu.

## How to start tinkering with the project

  1. Clone this repo.

  2. Run these commands in the project directory, and run them again every time you pull down new changes *(after every `git pull`):*

    1. `npm install` — install all project dependencies locally (in the project folder, in `node_modules).

    2. `npm run build` — build all of the project's TypeScript source code.

  3. Run the dev server so you can launch the game locally *(do this whenever you start working):*

    1. `npm run server` — start running the project's internal web server. Hit `CTRL-C` when you want to stop the server process.

    2. Visit [http://localhost:8080/](http://localhost:8080/) to launch the game. I put this dev server on port 8080 because port 80 was giving Lonnie issues (probably firewall related). You can change this port in the `package.json` *(try not to commit it though).*

## Some development notes

  - Art asset paths and filenames must be all lowercase, at least for now, as it seems to be some weird bug or limitation with the Babylon loaders.

  - `npm run watch` — start a compile-on-save process, which will rebuild TypeScript files on the fly as you save changes.

    - You might want to run this watch process in a separate Cmder tab (`CTRL-T` for new tab).

  - [Travis CI will build each commit](https://travis-ci.org/ChaseMoskal/Nanoshooter), and email me when you break the build :P

  - Later on, loading performance will be optimized via Almond module bundling.

## Art viewer mode for previewing any OBJ file

You can preview individual art assets in the Nanoshooter framework, by simply adding their path to the URL after a question mark. This feature, the "Art Viewer" allows you to view any `.obj` file in-game without the need to code up a new corresponding Entity in TypeScript.

So, if the game's link is normally this *(it'll be 'localhost' if you're working locally):*
  - http://chasemoskal.github.io/Nanoshooter/

Activate the Art Viewer by adding a question mark followed by the `.obj` file path:
  - [http://chasemoskal.github.io/Nanoshooter/**?art/tanks/alpha/tank-alpha.obj**](http://chasemoskal.github.io/Nanoshooter/?art/tanks/alpha/tank-alpha.obj)
  - [http://chasemoskal.github.io/Nanoshooter/**?art/tanks/bravo/tank-bravo.obj**](http://chasemoskal.github.io/Nanoshooter/?art/tanks/bravo/tank-bravo.obj)

For now at least, only `.obj` files will be loaded. If the file isn't found, or there's an error loading the file, nothing will appear, and the error will be reported to the javascript developer console (F12). Interestingly, we've discovered that any full URL to a remotely hosted OBJ on the internet will load up fine.

The art viewer might be really handy while working on art assets in Blender. You can point the game at an `.obj` file to preview it, then tweak it in Blender, re-export the `.obj`, and then hit refresh in the browser to see results instantly. You can do this over and over again, no build step required.

## Licensing

**The entire Nanoshooter project – the framework, the game, the artwork, etc – is open source, MIT Licensed.**

This means you're free to:
  - Reuse Nanoshooter's art assets for your own purposes (commercial or otherwise).
  - Reuse Nanoshooter's source code components for your own purposes (commercial or otherwise).
  - Fork the Nanoshooter project, and totally make your own game based on it (commercial or otherwise).

The [BabylonJS](https://github.com/BabylonJS/Babylon.js) engine *(which the Nanoshooter framework rides on top of and leverages)* is itself Apache 2.0 licensed.
