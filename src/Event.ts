import State from "./State";
import {uuid} from "./util/uuid";

export default class Event<T = any> {
    public readonly id: string;
    public payload: T;
    public from: State;
    public to: State;
    public props?: any;
    constructor() {
        this.id = uuid();
    }

    public async emit() {
        await this.preEmit();
        const res = await this.dispatch();
        if (this.update) {
            res.payload = this.update(this.payload, this.from.payload);
        }
        return { res, callback: this.postEmit };
    }

    protected async dispatch() {
        return Promise.resolve(this.to);
    }

    public async preEmit() {
        return Promise.resolve();
    }

    public update: (a: any, b: any) => any = null;

    public postEmit() {}

    public with(data: T) {
        this.payload = data;
        return this;
    }
}