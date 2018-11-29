import {uuid} from "./util/uuid";

export default class State {
    public readonly id: string;

    public constructor(public name?: string) {
        this.id = uuid();
    }
}