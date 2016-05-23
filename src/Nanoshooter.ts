
import Game, {GameOptions} from "./Engine/Game";

export default class Nanoshooter extends Game {
    constructor(options: NanoshooterOptions) {
        super(options);
    }
}

export interface NanoshooterOptions extends GameOptions {}
