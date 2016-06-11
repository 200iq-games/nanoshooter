
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

## Networking concepts

This table is an ancient conceptual development from the 'ol grunt-wars/fishduck/nanoshooter/fps-project days:

| HOST | CONTROL | ROLE   |
|:----:|:-------:|:------:|
| true | true    | Master |
| true | –       | Server |
| –    | true    | Client |
| –    | –       | Proxy  |

The idea is that each entity has these two booleans that are very relevant to the way entities should behave during a logic tick.

**In a fully offline single-player game,**
  - HOST and CONTROL are both ALWAYS **`true`**, which is to say that every entity needs only to behave in the "Master" role. This is straightforward and easy to code for, no special concepts need be abided to.

**In an online multiplayer game,** coding entities is signficantly more complicated:
  - HOST is whether or not your entity is currently responsible for relaying the state changes (like position) to all other remote copies of the entity via the Network. This is more relevant to the Network that handles the entity, than the entity itself.
  - CONTROL is whether or not your local copy of the entity is "in the driver's seat", making logical decisions like responding to keypresses and the like, and also performing the physical simulation of the entity and relaying these changes to the HOST copy of the entity for distribution to the other clients.
