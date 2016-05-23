
export default class Stateful {
    state: State;

    apply(state: State) {
        for (let key of Object.keys(state))
            this.state[key] = state[key];
    }

    serialize(): string {
        return JSON.stringify(this.state);
    }

    deserialize(data: string) {
        this.state = JSON.parse(data);
    }
}

export interface State {}
