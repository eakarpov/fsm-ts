import {uuid} from "./util/uuid";

export default class State {
    public readonly id: string;
    public payload: any;

    public constructor(public name?: string) {
        this.id = uuid();
    }

    public with<T extends any>(payload: T) {
        this.payload = payload;
        return this;
    }
}