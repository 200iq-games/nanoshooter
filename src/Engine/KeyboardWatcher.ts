
/**
 * Options for creating a new keyboard watcher instance.
 */
export interface KeyboardWatcherOptions {
  keyNames: { [keyLabel: string]: string }
}

/**
 * Watch keyboard activity.
 */
export default class KeyboardWatcher {

  /** Dictionary of key codes by key names. This gives each key code a key name. */
  protected codes: { [keyName: string]: number } = {
    w: 87,
    a: 65,
    s: 83,
    d: 68,
    space: 32,
    q: 81,
    e: 69,
    shift: 16,
    ctrl: 17,
    alt: 18,
    ['1']: 49,
    ['2']: 50,
    ['3']: 51,
    ['4']: 52,
    ['5']: 53,
    ['6']: 54,
    ['7']: 55,
    ['8']: 56,
    ['9']: 57,
    ['0']: 48
  }

  /** Dictionary of key names by key labels. This gives each key name a handy label. */
  protected labels: { [keyLabel: string]: string } = {}

  /** Dictionary of status booleans by key labels. This stores the current status of a given key label. */
  status: { [keyLabel: string]: boolean } = {}

  /**
   * Create a keyboard watcher which watches the provided keys.
   */
  constructor({keyNames}: KeyboardWatcherOptions) {
    this.labels = keyNames

    // Initializing the status dictionary, based on the provided labels.
    Object.keys(keyNames).forEach(keyLabel => {
      const keyName = keyNames[keyLabel]

      // Throw error for unknown keys.
      if (!(keyName in this.codes)) throw `Unknown key: ${keyName}`

      // Initial key status is null.
      this.status[keyLabel] = null
    })

    // Add event listeners.
    this.bind()
  }

  /**
   * Start watching keyboard activity, by adding event listeners.
  */
  bind() {
    addEventListener('keydown', this.keydown)
    addEventListener('keyup', this.keyup)
  }

  /**
   * Stop watching keyboard activity, by removing event listeners.
   */
  unbind() {
    removeEventListener('keydown', this.keydown)
    removeEventListener('keyup', this.keyup)
  }

  /**
   * Given a key code, return the key name.
   */
  protected getKeyNameByKeyCode(keyCode: number): string {
    return Object.keys(this.codes).find(keyName => this.codes[keyName] === keyCode)
  }

  /**
   * Given a key name, return the key label.
   */
  protected getKeyLabelByKeyName(keyName: string): string {
    return Object.keys(this.labels).find(keyLabel => this.labels[keyLabel] === keyName)
  }

  /**
   * Handle the moment that a key is struck.
   * Set the key status to true.
   */
  protected keydown = (event: KeyboardEvent) => {

    // Identify which key is being struck.
    const struckKeyName = this.getKeyNameByKeyCode(event.keyCode)

    // Identify which label the struck key is associated with.
    const struckKeyLabel = this.getKeyLabelByKeyName(struckKeyName)

    // Set key status to true.
    this.status[struckKeyLabel] = true
  }

  /**
   * Handle the release of a key.
   * Set the key status to false.
   */
  protected keyup = (event: KeyboardEvent) => {

    // Identify which key is being released.
    const releasedKeyName = this.getKeyNameByKeyCode(event.keyCode)

    // Identify which label the released key is associated with.
    const releasedKeyLabel = this.getKeyLabelByKeyName(releasedKeyName)

    // Set key status to false.
    this.status[releasedKeyLabel] = false
  }
}
