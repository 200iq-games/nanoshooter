
# Nanoshooter — [![Build Status](https://travis-ci.org/ChaseMoskal/Nanoshooter.svg?branch=master)](https://travis-ci.org/ChaseMoskal/Nanoshooter) — [![Join the chat at https://gitter.im/ChaseMoskal/Nanoshooter](https://badges.gitter.im/ChaseMoskal/Nanoshooter.svg)](https://gitter.im/ChaseMoskal/Nanoshooter?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

*Nanoshooter is a free 3D open source online multiplayer action web game and framework, built on [BabylonJS.](http://www.babylonjs.com/)*
 - [**Launch the Nanoshooter Sandbox now!**](http://chasemoskal.github.io/Nanoshooter/)
 - [Nanoshooter Development Roadmap on Trello.](https://trello.com/b/Tr656Gke/nanoshooter-roadmap)
 - [Gitter text chat — say hi!](https://gitter.im/ChaseMoskal/Nanoshooter)

## Project goals

  - Make a cool multiplayer tank game.
    - Runs web-native: no install, no plugins, just straight webcode.
    - Third-person. We're thinking little robotic drone tanks. Fighting for resources. On distant planets. In the distant future.

  - Create a robust framework 3D online multiplayer action web games on [BabylonJS](https://github.com/BabylonJS/Babylon.js).
    - Online multiplayer action.
    - Realtime collaborative map editing experience.
    - Platform, tooling, and workflow for rapid web game development.
    - Eventually, this networked framework will move out into its own repository, and be given its own legendary name.

## Free and open licensing

**Nanoshooter is an open source project under the MIT License.**

  - All Nanoshooter collaborator contributions — source code, art assets, and otherwise — are free open source contributions.

  - You are free to reuse any of Nanoshooter's components (any art assets, source code) for your own purposes (commercial or otherwise).

  - You are free to fork the Nanoshooter project, and totally make your own game based on it (commercial or otherwise).

  - Third party libraries are included together with their own license files in this repository.

## We welcome newcomers — join us!

We want help with:
 - Artwork of all kinds
 - Gameplay/entity code
 - Framework code
 - Process and tooling
 - Concepts and ideas
 - And more!

We're looking for collaborators of all skillsets and skill levels. This is a great project to practice or learn new skills, and to support free software and the open game development community.

Whether you have your own ideas for Nanoshooter, or just want to build your own dream game that uses Nanoshooter's framework for online multiplayer action, we'd love to hear from you.

Say hi in the [Gitter chat!](https://gitter.im/ChaseMoskal/Nanoshooter)

# Development guide

## Software you need

  - [**Git**](https://git-scm.com/) — version control, teamwork.

  - [**Node.js**](https://nodejs.org/en/) — development environment runtime (runs build scripts and stuff).

  - [**Visual Studio Code**](https://code.visualstudio.com/) — editor of choice for this project.

    - It's an open-source cross-platform full TypeScript IDE, and this project is preconfigured for it.

    - When you install VSCode, you'll definitely want to enable that *Open Code from Right-click Context Menu* option that the installer has. *Very handy.*

  - **Command-line utility**

    - *On Linux/Mac* — just use the Terminal that came with your system.

    - *On Windows* — use Git Bash (comes with Git).

      - Or install [**Cmder**](http://cmder.net/).

        With Cmder, follow [these lame instructions](https://github.com/cmderdev/cmder/wiki/%5BWindows%5D-%22Open-Cmder-Here%22-in-context-menu) to gain the lovely ability to *Open Cmder Here* into any folder from the right-click context menu.

## Build and run the game locally

  1. **Clone this repo.**

  2. **Build the project.**

      Run these commands in the project directory, and run them again every time you pull down new changes *(after every `git pull`):*

      1. `npm install` — install all project dependencies locally (in the project folder, in `node_modules`).

      2. `npm run build` — build all of the project's TypeScript source code.

  3. **Launch the game locally.**

      1. `npm run server` — start running the project's internal web server. Hit `CTRL-C` when you want to stop the server process.

      2. Visit [http://localhost:8080/](http://localhost:8080/) to launch the game. I put this dev server on port 8080 because port 80 was giving Lonnie issues (probably firewall related).

## Development tips

  - Art asset paths and filenames must be all lowercase, at least for now, as it seems to be some weird bug or limitation with the Babylon loaders.

  - `npm run watch` — start a compile-on-save process, which will rebuild TypeScript files on the fly as you save changes. Pro tip: Run this and the server at the same time.

  - [Travis CI will build each commit](https://travis-ci.org/ChaseMoskal/Nanoshooter), and email me when you break the build :P

## Contribution guidelines

We want to maintain a tidy codebase.

  - Please don't: commit new code straight onto `master`, except for little bugfixes.

  - Please do: push new feature branches and submit pull requests for them.

More on this section forthcoming.

## Art viewer mode — preview any OBJ file

You can preview individual art assets in the Nanoshooter framework, by simply adding their path to the URL after a question mark. This feature, the "Art Viewer" allows you to view any `.obj` file in-game without the need to code up a new corresponding Entity in TypeScript.

So, if the game's link is normally this *(it'll be 'localhost' if you're working locally):*
  - http://chasemoskal.github.io/Nanoshooter/

Activate the Art Viewer by adding a question mark followed by the `.obj` file path:
  - [http://chasemoskal.github.io/Nanoshooter/**?art/tanks/alpha/tank-alpha.obj**](http://chasemoskal.github.io/Nanoshooter/?art/tanks/alpha/tank-alpha.obj)
  - [http://chasemoskal.github.io/Nanoshooter/**?art/tanks/bravo/tank-bravo.obj**](http://chasemoskal.github.io/Nanoshooter/?art/tanks/bravo/tank-bravo.obj)

For now at least, only `.obj` files will be loaded. If the file isn't found, or there's an error loading the file, nothing will appear, and the error will be reported to the javascript developer console (F12). Interestingly, we've discovered that any full URL to a remotely hosted OBJ on the internet will load up fine.

The art viewer might be really handy while working on art assets in Blender. You can point the game at an `.obj` file to preview it, then tweak it in Blender, re-export the `.obj`, and then hit refresh in the browser to see results instantly. You can do this over and over again, no build step required.

# Backstory and motivation

*The original Nanoshooter... those were the days*

[![](http://img.youtube.com/vi/DMLNCdJ3dls/mqdefault.jpg)](https://www.youtube.com/watch?v=DMLNCdJ3dls)

&nbsp;&nbsp; *↑ Click to watch some early gameplay on YouTube.*

The Nanoshooter project is a reboot of our old project on the Blender Game Engine. It was written in Python and gameplay streamed over UDP sockets. This is familiar territory for us: we're now rewriting this game framework architecture that we once had running back in the BGE. Years later, this time around we're redoing Nanoshooter the right way, at a professional caliber, and running openly on the web.

Eventually, once our networking framework became capable enough, we evolved Nanoshooter into what we called the [*First Person Shooter Project*](https://github.com/Gomer3261/fps-project). We continued to evolve the architecture until we had a realtime collaborative map editing experience, synchronized physics, and more. The FPS project was cool, but we've decided to bring back the tank game that Nanoshooter could have been, instead. There are plenty of first person shooters already around, wouldn't you say?

Reading around the web, it looks like most game dev hobbyists are trying to use WebSockets and node servers to power their multiplayer web games. WebSockets are not viable for the level of realtime action we need for a game like this. Thankfully, WebRTC came along, and more specifically —

  - [***RTCDataChannel***](https://www.w3.org/TR/webrtc/#rtcdatachannel) — *The Holy Grail of Web Multiplayer*

It's what we've been waiting for all this time, and it's still in the process of descending from the heavens (it's only supported by Chrome and Firefox at the moment). `RTCDataChannel` is a beautiful gem. The `unreliable` transfer functionality is necessary — it really is the key to fast-paced realtime multiplayer action.
