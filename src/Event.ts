import State from "./State";
import {uuid} from "./util/uuid";

export default class Event<T = any> {
    public readonly id: string;
    public payload: T;
    public from: State;
    public to: State;
    public props?: any;
    public cost?: { [key: string]: number };
    constructor() {
        this.id = uuid();
    }

    public async emit(resources: { [key: string]: number }) {
        await this.preEmit();
        const res = await this.dispatch();
        if (this.cost) {
            Object.keys(this.cost).forEach(cost => {
                if (resources.hasOwnProperty(cost)) {
                    if ((resources[cost] - this.cost[cost]) < 0) {
                        throw new Error('Not enough resources!');
                    }
                    resources[cost] -= this.cost[cost];
                } else {
                    throw new Error('Unknown cost value');
                }
            });
        }
        if (this.update) {
            res.payload = this.update(this.payload, this.from.payload, resources);
        }
        return { res, callback: this.postEmit };
    }

    protected async dispatch() {
        return Promise.resolve(this.to);
    }

    public async preEmit() {
        return Promise.resolve();
    }

    public update: (a: T, b: any, resources: { [key: string]: number }) => any = null;

    public postEmit() {}

    public with(data: T) {
        this.payload = data;
        return this;
    }
}