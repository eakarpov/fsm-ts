import State from "./State";
import Event from "./Event";

export class OnClass {
    constructor(public event: Event) {}

    public pre(f: any) {
        this.event.preEmit = f;
        return this;
    }

    public post(f: any) {
        this.event.postEmit = f;
        return this;
    }

    public to(state: State) {
        this.event.to = state;
        return this;
    }

    public data(f: any) {
        this.event.update = f;
        return this;
    }
}

export function on(event: Event) {
    return new OnClass(event);
}