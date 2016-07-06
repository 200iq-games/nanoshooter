
/**
 * State object with operations for applying deltas and performing diffs.
 */
export default class State {

  /**
   * Apply a delta onto a state, and return the diff.
   */
  static applyDelta(state: any, delta: any): any { throw 'Coming soon' }

  /**
   * Return the delta diff between two states.
   */
  static diff(alpha: any, beta: any): any { throw 'Coming soon' }

  /** Any serializable key-string property is allowed on a state instance. */
  [key: string]: any

  /** Apply a delta onto this state. */
  applyDelta(delta: any): any {
    return State.applyDelta(this, delta)
  }

  /** Generate a diff from this state to a provided one. */
  diff(beta: any): any {
    return State.diff(this, beta)
  }
}

/**
 * Take action on an object and all of its set properties.
 */
function recursiveAction(subject: any, action: (value: any) => void) {
  action(subject)
  for (const key of Object.keys(subject)) {
    const value = subject[key]
    recursiveAction(value, action)
  }
}
