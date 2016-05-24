
import Entity, {EntityState, EntityOptions} from "../Engine/Entity";
import {Message} from "../Engine/Messenger";
import {TickInfo} from "../Engine/Ticker";

/**
 * Entity that broadcasts a message whenever it detects Spacebar has been pressed.
 */
export default class Broadcaster extends Entity {
    label = "Broadcaster";

    buttonListener = (event: KeyboardEvent) => {
        if (event.keyCode === 32) {
            this.spacebar();
            event.preventDefault();
            return false;
        }
    };

    constructor(options: EntityOptions) {
        super(options);
        window.addEventListener("keydown", this.buttonListener);
    }

    spacebar() {
        this.game.messenger.send({
            recipients: "*",
            data: "This is a Spacebar Broadcast!"
        });
    }

    removal() {
        window.removeEventListener("keydown", this.buttonListener);
    }
}
