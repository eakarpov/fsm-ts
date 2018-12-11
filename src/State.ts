import {uuid} from "./util/uuid";

export default class State<T = any> {
    public readonly id: string;
    public payload: T;

    public constructor(public name?: string) {
        this.id = uuid();
    }

    public with(payload: T) {
        this.payload = payload;
        return this;
    }
}