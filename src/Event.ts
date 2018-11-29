import State from "./State";
import {uuid} from "./util/uuid";

export default class Event {
    public readonly id: string;
    constructor(public from: State, public to: State) {
        this.id = uuid();
    }

    public async emit() {
        await this.preEmit();
        const res = await this.dispatch();
        return { res, callback: this.postEmit };
    }

    protected async dispatch() {
        return Promise.resolve(this.to);
    }

    private async preEmit() {
        return Promise.resolve();
    }

    protected async postEmit() {
        return Promise.resolve();
    }
}