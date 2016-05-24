
import Game from "./Game";

/**
 * Messaging center.
 * Allows entities to send messages to each other.
 * Messages are supposed to represent events that affect the game state.
 * In online multiplayer, these messages are networked.
 */
export default class Messenger {
    game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    /**
     * Deliver a message.
     */
    send(message: Message) {
        let delivered = false;

        for (const id of Object.keys(this.game.entities)) {
            const entity = this.game.entities[id];

            // Broadcast message.
            if (message.recipients === "*") {
                entity.receive(message);
                delivered = true;
            }

            // Targeted message.
            else if (message.recipients.constructor === Array) {
                const recipients = <string[]> message.recipients;
                if (recipients.some(id => id === entity.id)) {
                    entity.receive(message);
                    delivered = true;
                }
            }

            else throw "Unknown type for message recipients";
        }

        if (!delivered) throw "Message delivery failed";
    }
}

/**
 * Generic message.
 */
export interface Message {

    /** Array of recipient ID strings, or "*" indicating broadcast to all entities. */
    recipients: string | string[];

    /** Message data body. */
    data: any;
}
