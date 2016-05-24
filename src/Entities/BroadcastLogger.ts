
import Entity, {EntityState, EntityOptions} from "../Engine/Entity";
import {Message} from "../Engine/Messenger";

export default class BroadcastLogger extends Entity {
    label = "BroadcastLogger";

    receive(message: Message) {
        if (message.recipients === "*")
            this.game.log(`Message: "${message.data}"`);
    }
}
