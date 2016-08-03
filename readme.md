
# Nanoshooter — [![Build Status](https://travis-ci.org/AkkadianGames/Nanoshooter.svg?branch=master)](https://travis-ci.org/AkkadianGames/Nanoshooter) [![Join the chat at https://gitter.im/AkkadianGames/AkkadianLounge](https://badges.gitter.im/AkkadianGames/AkkadianLounge.svg)](https://gitter.im/AkkadianGames/AkkadianLounge?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

![Nanoshooter](art/banner/banner.jpg)

## Robotic tank combat 3D multiplayer action web game

  - [**Sandbox**](http://akkadiangames.github.io/Nanoshooter/) — launch the in-progress sandbox gameplay immediately.
  - [**Roadmap**](https://trello.com/b/Tr656Gke/nanoshooter-roadmap) — peer into the Nanoshooter's future.
  - [**Gitter**](https://gitter.im/AkkadianGames/AkkadianLounge) — text chat, pop in and say hi!

### Nanoshooter is

  - Currently in early development.
  - Free and open source — ISC licensed.
  - Seeking collaborators.
  - Written in TypeScript.
  - Built on [Susa](https://github.com/AkkadianGames/Susa) — a networked game framework (Nanoshooter's sister project).
  - Built on [BabylonJS](http://www.babylonjs.com/), a 3D web game engine.
  - **An [❂ Akkadian Games](https://github.com/AkkadianGames) project:**
    - [Nanoshooter](https://github.com/AkkadianGames/Nanoshooter#readme) → *robotic tank combat 3D multiplayer action web game.*
    - [Susa](https://github.com/AkkadianGames/Susa#readme) → *networked web game framework.*

### Vision

  - Third-person robotic tank combat. Fight for resources. On distant planets. In the distant future.
  - Run web-native: no install, no plugins – just straight webcode.
  - Powerful online collaborative map editing experience.
  - Link friends directly into your game. They start as anon's and they can choose a nickname or register an account.
  - Matchmaking for 1v1s or 4v4s.

## Help wanted — newcomers, join us!

We're looking for collaborators of all skillsets and skill levels. This is a great project to practice or learn new skills, and to support free software and the open game development community. We need help with:

 - Artwork of all kinds
 - Gameplay/entity code
 - Framework code (Susa)
 - Process and tooling
 - Concepts and ideas
 - And more!

Whether you have your own ideas for Nanoshooter, or just want to build your own dream game that uses Susa for online multiplayer action, we'd love to hear from you.

Say hi in the [Gitter chat!](https://gitter.im/AkkadianGames/AkkadianLounge)

--------

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

## Build and run the game locally

  1. **Clone this repo.**

  2. **Build the project.**

      Run these commands in the project directory, and run them again every time you pull down new changes *(after every `git pull`):*

      1. `npm install` — install all project dependencies locally (in the project folder, in `node_modules`).

      2. `npm run build` — build all of the project's TypeScript source code (for Susa and Nanoshooter).

  3. **Launch the game locally.**

      1. `npm run server` — start running the project's internal web server. Hit `CTRL-C` when you want to stop the server process.

      2. Visit [http://localhost:8080/](http://localhost:8080/) to launch the game. I put this dev server on port 8080 because port 80 was giving Lonnie issues (probably firewall related).

## Development tips

  - Art asset paths and filenames must be all lowercase, at least for now, as it seems to be some weird bug or limitation with the Babylon loaders.

  - [Travis CI will build each commit](https://travis-ci.org/AkkadianGames/Nanoshooter), and email me when you break the build :P

  - Art viewer mode, preview any OBJ file. Add a question mark "?" followed by the path of an OBJ file to view.

      - Change your link like so:
        - http://akkadiangames.github.io/Nanoshooter/
        - [http://akkadiangames.github.io/Nanoshooter/**?art/tanks/alpha/tank-alpha.obj**](http://akkadiangames.github.io/Nanoshooter/?art/tanks/alpha/tank-alpha.obj)

--------

# Backstory and motivation

*The original Nanoshooter... those were the days*

[![](http://img.youtube.com/vi/DMLNCdJ3dls/mqdefault.jpg)](https://www.youtube.com/watch?v=DMLNCdJ3dls)

&nbsp;&nbsp; *↑ Click to watch some early gameplay on YouTube.*

The Nanoshooter project is a reboot of our old project on the Blender Game Engine. It was written in Python and gameplay streamed over UDP sockets. This is familiar territory for us: we're now rewriting this game framework architecture that we once had running back in the BGE. Years later, this time around we're redoing Nanoshooter the right way, at a professional caliber, and running openly on the web.

Eventually, once our networking framework became capable enough, we evolved Nanoshooter into what we called the [*First Person Shooter Project*](https://github.com/Gomer3261/fps-project). We continued to evolve the architecture until we had a realtime collaborative map editing experience, synchronized physics, and more. The FPS project was cool, but we've decided to bring back the tank game that Nanoshooter could have been, instead. There are plenty of first person shooters already around, wouldn't you say?

Reading around the web, it looks like most game dev hobbyists are trying to use WebSockets and node servers to power their multiplayer web games. WebSockets are not viable for the level of realtime action we need for a game like this. Thankfully, WebRTC came along, and more specifically —

  - [***RTCDataChannel***](https://www.w3.org/TR/webrtc/#rtcdatachannel) — *The Holy Grail of Web Multiplayer*

It's what we've been waiting for all this time, and it's still in the process of descending from the heavens (it's only supported by Chrome and Firefox at the moment). `RTCDataChannel` is a beautiful gem. The `unreliable` transfer functionality is necessary — it really is the key to fast-paced realtime multiplayer action.
