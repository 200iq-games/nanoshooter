
# Nanoshooter – [![Build Status](https://travis-ci.org/ChaseMoskal/Nanoshooter.svg?branch=master)](https://travis-ci.org/ChaseMoskal/Nanoshooter) – [***PLAY NOW!***](http://chasemoskal.github.io/Nanoshooter/)

## Start tinkering!

  1. Clone this repo.
  2. Open command line to project directory. Enter: 
    1. `npm install` – Install all project dependencies (locally).
    2. `npm run build` – Build the project's TypeScript source.
  3. Browse to `index.html`.

## Notes

  - Open the directory in [Visual Studio Code](https://code.visualstudio.com/).
    - `Ctrl-Shift-B` to build.
  - Loading performance will be optimized via Almond module bundling.
  - [Travis CI builds on each commit.](https://travis-ci.org/ChaseMoskal/Nanoshooter)
  - `npm run watch` – Start a compile-on-save process.
  - All 3D asset filenames must be lowercase – files such as `*.blend`, `*.obj`, `*.mtl` – at least for now, as it seems to be some weird bug or limitation with the Babylon loaders.

## Networking architecture

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

    #================#
    #===== HOST =====# Server-side behaviour for this entity.
    #================# Updates server-data

    #==================#
    #===== CLIENT =====# Client-side behaviour for this entity.
    #==================# Replicates server-data.

    #======================#
    #===== CONTROLLER =====# Controller behaviour for this entity.
    #======================# Updates controller-data; creates memos.

    #=================#
    #===== PROXY =====# Proxy behaviour for this entity.
    #=================# Replicates controller-data.

### Evolved networking

I want to evolve these concepts a little bit, so the names are up in the air for me at the moment.
  - I think I want to rename "Host" to "Server".
  - I think I want to rename "Controller" to "Master".
  - I might want to leave "Proxy" the way it is, or maybe consider "Slave" or "Replicant".

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
