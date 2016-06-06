/**
 * State object with operations for applying deltas and performing diffs.
 */
export default class State {
    /**
     * Apply a delta onto a state, and return the diff.
     */
    static applyDelta(state: any, delta: any): any;
    /**
     * Return the delta diff between two states.
     */
    static diff(alpha: any, beta: any): any;
    /** Any serializable key-string property is allowed on a state instance. */
    [key: string]: any;
    /** Apply a delta onto this state. */
    applyDelta(delta: any): any;
    /** Generate a diff from this state to a provided one. */
    diff(beta: any): any;
}
