
//
// Watcher class — monitors user input (keyboard/mouse).
//
//   - Declare bindings of your own aliases to inputs. Example:
//          const watcher = new Watcher({
//            bindings: {
//              'jump': Input.Space,
//              'crouch': Input.Ctrl
//            }
//          })
//
//   - Conveniently check on the status of your aliased inputs:
//          watcher.status['jump'] // true || false
//
//   - Attach a listener which is called whenever the status changes:
//          watcher.on('jump', report => {
//            if (report.status) startChargingJump()
//            else releaseChargedJump()
//          })
//
// Terminology and concepts.
//
//   - Bindings — relationships between aliases and inputs.
//   - Input — enum value of inputs that the watcher supports (which can be aliased via bindings).
//   - Status — an aliased input has a status boolean, true when the input is activated, false when the input is deactivated.
//   - Listener — listener functions associated with aliases, which are attached via on/off methods. Called whenever a status changes.
//
// Todo and status:
//
//   - The watcher and associated concepts still feel a little too complicated, inconsistent, rough around the edges.
//   - We really want to simplify this thing as much as we can — this is a good candidate for casual refactoring.
//   - This current implementation is on the fence about whether it's better to stick with string aliases/inputs, or to use enums across the board.
//

/**
 * Options for creating a new Watcher instance.
 */
export interface WatcherOptions {

  /**
   * Aliases for the inputs you'd like to watch.
   * Example, bindings: {'jump': Input.Space, 'crouch': Input.Ctrl}
   */
  bindings: Bindings
}

/**
 * Watch for user input, like on the keyboard, or with the mouse.
 *  - When you create a watcher instance, provide a `bindings` object which maps your own alias strings to inputs that you'd like to watch.
 *  - The watcher keeps an up-to-date status dictionary for every watched input.
 *  - TODO: You can attach/remove event listeners for any input.
 */
export default class Watcher {

  /** Up-to-date dictionary of status booleans by alias. This stores the current status of a given input. */
  status: { [alias: string]: boolean } = {}

  /** Dictionary of aliases to inputs. */
  protected bindings: Bindings = {}

  /** Array of listeners that are called whenever a status changes. */
  protected listenerBindings: {
    alias: string
    listener: Listener
  }[] = []

  /**
   * Create a watcher which monitors user inputs (keyboard/mouse).
   *  - Initialize the status dictionary, based on the provided labels.
   *  - Throw error for unknown inputs.
   *  - Initial input status is null.
   */
  constructor({bindings}: WatcherOptions) {
    this.bindings = bindings

    // Initialize the status dictionary, based on the provided labels.
    Object.keys(bindings).forEach(alias => {
      const input = bindings[alias]
      if (!(input in inputKeyCodeRelationships)) throw `Unknown input: ${input}`
      this.status[alias] = null
    })

    // Add event listeners.
    this.start()
  }

  /**
   * Start watching keyboard activity, by adding event listeners.
   */
  start() {
    addEventListener('keydown', this.keydown)
    addEventListener('keyup', this.keyup)
  }

  /**
   * Stop watching keyboard activity, by removing event listeners.
   */
  stop() {
    removeEventListener('keydown', this.keydown)
    removeEventListener('keyup', this.keyup)
  }

  /**
   * Assign a listener to an input change.
   */
  on(alias: string, listener: Listener) {
    const input = this.bindings[alias]
    if (!input) throw new Error(`Couldn't find binding for given alias '${alias}'`)
    this.listenerBindings.push({alias, listener})
  }

  /**
   * Remove a single listener, or clear all of an input's listener.
   *  - Provide a listener to remove that one specifically.
   *  - Omit the listener to clear all listeners from that input.
   */
  off(alias: string, listener?: Listener) {

    // Filter out unwanted bindings.
    this.listenerBindings = this.listenerBindings.filter(
      listenerBinding => listenerBinding.alias !== alias || (!!listener ? listenerBinding.listener !== listener : false)
    )
  }

  /**
   * Trigger a listener.
   */
  trigger(alias: string, status: boolean) {
    const input = this.bindings[alias]
    if (!input) throw new Error(`Couldn't find binding for given alias '${alias}'`)

    this.listenerBindings
      .filter(binding => binding.alias === alias)
      .forEach(binding => binding.listener({input, status}))
  }

  /**
   * Internal watcher handling for the moment that a key is struck.
   * Set the input's status to true.
   */
  protected keydown = (event: KeyboardEvent) => {

    const struckInput = this.getInputByKeyCode(event.keyCode)
    if (!struckInput) return

    const struckAlias = this.getAliasForInput(struckInput)
    if (!struckAlias) return

    this.status[struckAlias] = true
    this.trigger(struckAlias, true)
  }

  /**
   * Internal watcher handling for the moment that a key is released.
   * Set the input's status to false.
   */
  protected keyup = (event: KeyboardEvent) => {

    const releasedInput = this.getInputByKeyCode(event.keyCode)
    if (!releasedInput) return

    const releasedAlias = this.getAliasForInput(releasedInput)
    if (!releasedAlias) return

    this.status[releasedAlias] = false
    this.trigger(releasedAlias, false)
  }

  /**
   * Given a key code, return the input (or null if no match).
   */
  protected getInputByKeyCode(keyCode: number): Input {
    const relation = inputKeyCodeRelationships.find(relationship => relationship.code === keyCode)
    return relation ? relation.input : null
  }

  /**
   * Given an input, return the alias.
   */
  protected getAliasForInput(input: Input): string {
    return Object.keys(this.bindings).find(alias => this.bindings[alias] === input)
  }

  /**
   * Destruct this watcher.
   */
  destructor() {
    this.stop()
  }
}

/**
 * Watcher inputs.
 * These are all of the inputs that the watcher is capable to report about.
 */
export enum Input {

  // Coming soon:
  //  - Q, W, E, R, T, Y, U, I, O, P, BracketLeft, BracketRight
  //  - A, S, D, F, G, H, J, K, L, Semicolon, Quote
  //  - Z, X, C, V, B, N, M, Comma, Period, Slash

  One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Zero,
  Shift, Ctrl, Alt, Space,
  W, A, S, D, Q, E
}

/**
 * Dictionary of alias strings to inputs.
 */
export type Bindings = { [alias: string]: Input }

/**
 * Array of relationships between inputs and keycodes.
 */
export const inputKeyCodeRelationships: {
  input: Input
  code: number
}[] = [
  {input: Input.W,     code: 87},
  {input: Input.A,     code: 65},
  {input: Input.S,     code: 83},
  {input: Input.D,     code: 68},

  {input: Input.Q,     code: 81},
  {input: Input.E,     code: 69},

  {input: Input.Shift, code: 16},
  {input: Input.Ctrl,  code: 17},
  {input: Input.Alt,   code: 18},
  {input: Input.Space, code: 32},

  {input: Input.One,   code: 49},
  {input: Input.Two,   code: 50},
  {input: Input.Three, code: 51},
  {input: Input.Four,  code: 52},
  {input: Input.Five,  code: 53},
  {input: Input.Six,   code: 54},
  {input: Input.Seven, code: 55},
  {input: Input.Eight, code: 56},
  {input: Input.Nine,  code: 57},
  {input: Input.Zero,  code: 48}
]

/**
 * Listener callback which is given an input report (containing a status boolean) when it's called.
 */
export type Listener = (report: InputReport) => void

/**
 * Report that input listeners receive whenever an input's status changes.
 */
export interface InputReport {
  input: Input,
  status: boolean
}
