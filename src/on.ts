import State from "./State";
import Event from "./Event";

export class OnClass<T = any, K = any, R = any> {
    constructor(public event: Event<T>) {}

    public pre(f: any) {
        this.event.preEmit = f;
        return this;
    }

    public post(f: any) {
        this.event.postEmit = f;
        return this;
    }

    public to(state: State<K>) {
        this.event.to = state;
        return this;
    }

    public data(f: (eventData?: T, stateData?: R, resources?: {[key: string]: number}) => K, stateToData?: K) {
        this.event.update = f;
        return this;
    }

    public annotate(props: any) {
        this.event.props = props;
        return this;
    }

    public cost(payload: { [key: string]: number }) {
        this.event.cost = payload;
        return this;
    }
}

export function on<T = any, K = any, R = any>(event: Event<T>) {
    return new OnClass<T, K, R>(event);
}