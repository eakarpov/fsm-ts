import State from "./State";
import Event from "./Event";

export default class FSM {
    private states: State[] = [];
    private events: Event[] = [];
    private current?: State;

    constructor() {}

    public addState(state: State) {
        this.states.push(state);
        return this;
    }

    public addEvent(event: Event) {
        this.events.push(event);
        return this;
    }

    public async emit(event: Event) {
        if (!this.current) throw new Error('No initial state');
        const result = this.events.find((ev: Event) => ev.id === event.id);
        if (result) {
            if (result.from === this.current) {
                const res = await result.emit();
                this.current = res.res;
                res.callback();
                return this;
            } else {
                throw new Error('Event is not related to current state');
            }
        } else {
            throw new Error('Event not found');
        }
    }

    public initial(state: State) {
        const result = this.states.find((s: State) => s.id === state.id);
        if (result) {
            this.current = state;
            return this;
        } else {
            throw new Error('State is not uploaded');
        }
    }
}