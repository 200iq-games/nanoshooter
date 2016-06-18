
# Nanoshooter – [![Build Status](https://travis-ci.org/ChaseMoskal/Nanoshooter.svg?branch=master)](https://travis-ci.org/ChaseMoskal/Nanoshooter) – [***PLAY NOW!***](http://chasemoskal.github.io/Nanoshooter/)

## Start tinkering!

  1. Clone this repo.

  2. Run these commands first, and again every time you pull down new changes *(after every `git pull`):*

    1. `npm install` – Install all project dependencies (locally).

    2. `npm run build` – Build all of the project's TypeScript source code.

  3. Run the dev server so you can launch the game locally *(do this whenever you start working):*

    1. `npm run server` – Start running the project's internal web server. Hit `CTRL-C` when you want to stop the server process.

    2. Visit http://localhost:8080/ to launch the game. I put this dev server on port 8080 because port 80 was giving Lonnie issues (probably firewall related). You can change this port in the `package.json` *(try not to commit it though).*

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

## Art viewer: preview art assets

You can preview individual art assets in the game engine, by simply adding their path to the URL after a question mark. This feature, the "Art Viewer" allows you to view an `.obj` file in-game without the need to code up a new corresponding Entity in TypeScript.

So, if the game's link is normally this *(it'll be 'localhost' if you're working locally):*
  - http://chasemoskal.github.io/Nanoshooter/

Activate the Art Viewer by adding a question mark followed by the `.obj` file path:
  - [http://chasemoskal.github.io/Nanoshooter/**?art/tanks/alpha/tank-alpha.obj**](http://chasemoskal.github.io/Nanoshooter/?art/tanks/alpha/tank-alpha.obj)
  - [http://chasemoskal.github.io/Nanoshooter/**?art/tanks/bravo/tank-bravo.obj**](http://chasemoskal.github.io/Nanoshooter/?art/tanks/bravo/tank-bravo.obj)

For now at least, only `.obj` files will be loaded. If the file isn't found, or there's an error loading the file, nothing will appear, and the error will be reported to the javascript developer console (F12).

The art viewer might be really handy while working on art assets in Blender. You can point the game at an `.obj` file to preview it, then tweak it in Blender, re-export the `.obj`, and then hit refresh in the browser to see results instantly. You can do this over and over again, no build step required.

----

# Networking architecture

### Rediscovering old developments

The crusade to improve our ancient networking architectural concepts since the 'ol grunt-wars/fishduck/nanoshooter/fps-project days still rages onward. I was perusing through the 'ol [fps-project entity base-class code](https://github.com/Gomer3261/fps-project/blob/master/gamedata/newProg/engine/entities/baseEntity.py) *(thank you Geoff for preserving this on GitHub)*, and I found this function that runs each entity's logic:

```python
def run(self, gamestate):
  self.memoOutbox = [] # list of outgoing memos.
  self.deltaOutbox = [] # list of outgoing deltas.

  ### host/client ###
  if self.engine.host:
    self.host(gamestate)
  else:
    self.client(gamestate)

  ### controller/proxy ###
  if gamestate.hasControl(self.id):
    self.controller(gamestate)
  else:
    self.proxy(gamestate)

  return self.deltaOutbox, self.memoOutbox # Returns delta data and memos.
```

***Gold!*** Nanoshooter's architecture will carry this torch forward.

As you can see, our entities had four methods for running behavior, and two of them would always run.
  - We run the `host` or `client` method, depending on if we were the host of the game or not.
  - We run the `controller` or `proxy` method, depending on whether we have control over the entity or not.

Here are some old comments that explain a little about each method:
  - HOST: Server-side behaviour for this entity. Updates server-data
  - CLIENT: Client-side behaviour for this entity. Replicates server-data.
  - CONTROLLER: Controller behaviour for this entity. Updates controller-data; creates memos.
  - PROXY: Proxy behaviour for this entity. Replicates controller-data.

### Evolved networking

I want to evolve these concepts a little bit, so the names are up in the air for me at the moment.
  - I think I want to rename "Host" to "Server".
  - I think I want to rename "Controller" to "Master".
  - I might want to leave "Proxy" the way it is, or maybe consider "Slave" or "Replicant". "Imitation"?

I want to distinguish the names of the boolean that deduce the roles, from the names of the roles themselves.

The idea is that each entity has these two booleans, HOST and CONTROL, that are used to deduce the way entities should behave and be treated during a logic tick (their ROLE). Your entity is always in either a SERVER or a CLIENT (depending on HOST), as well as a MASTER or PROXY (depending on CONTROL) – which can yield four possible roles for your entity:

| HOST | CONTROL | ENTITY ROLE   |
|:----:|:-------:|:-------------:|
| true | true    | Server/Master |
| true | –       | Server/Proxy  |
| –    | true    | Client/Master |
| –    | –       | Client/Proxy  |

**In a fully offline single-player game,**
  - HOST and CONTROL are both ALWAYS **`true`** for all entities, which is to say that every entity needs only to behave in the "Server/Master" role. This is straightforward and easy to code for, no special concepts need be abided to.

**In an online multiplayer game,** coding entities is more complicated:
  - HOST is whether or not your entity is currently responsible for relaying the state changes (like position) to all other remote copies of the entity via the Network. This is more relevant to the Network that handles the entity, than the entity itself.
  - CONTROL is whether or not your local copy of the entity is "in the driver's seat", making logical decisions like responding to keypresses and the like, and also performing the physical simulation of the entity and relaying these changes to the HOST copy of the entity for distribution to the other clients.

This game engine is ***not*** about handling all of the netcode for you, or providing a 'plug-and-play' developer experience that eliminates the need to make special considerations for networking.. no, not at all.

On the contrary, this networking architecture is super ***flexible***. Each entity can have wildly different netcode approaches. You could have some entities of your game working in a deterministic RTS-style networking architecture, and have other entities that are operating in an unreal-engine style realtime action context as well, all in the same game. The game engine doesn't apply blanket networking rules to all entities – it gives each and every entity all of the networking tools it needs to fabricate its own netcode and architecture for itself.

Hopefully some nicely prefab'd networked entity base-classes with generic netcode best practices baked in could help make prototyping and building online multiplayer games a pleasant and elegant experience here.
