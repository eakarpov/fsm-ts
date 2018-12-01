import State from "./State";
import Event from "./Event";
import {OnClass} from "./on";
import {wait} from "./wait";

export default class FSMClass {
    private states: State[] = [];
    private events: Event[] = [];
    private current?: State;
    private exec: any = [];
    private started: boolean = false;
    private log: boolean = false;
    private logF?: any;

    constructor() {}

    private addState(state: State) {
        this.states.push(state);
        return this;
    }

    private addEvent(event: Event) {
        this.events.push(event);
        return this;
    }

    private execute() {
        if (this.exec.length === 0) {
            this.started = false;
            return;
        }
        const { obj, data } = this.exec.pop();
        if (obj.from === this.current) {
            obj.payload = data;
            obj.emit().then((res: any) => {
                if (this.log) {
                    if (this.logF) {
                        console.log(this.logF(obj.from, res.res, obj, data));
                    } else {
                        console.log(`Transition from ${obj.from.id} to ${res.res.id}`);
                    }
                }
                this.current = res.res;
                res.callback();
                this.execute();
            });
            return this;
        } else {
            throw new Error('Event is not related to current state');
        }
    }

    public emit(event: Event, payload: any) {
        if (!this.current) throw new Error('No initial state');
        const result = this.events.find((ev: Event) => ev.id === event.id);
        if (result) {
            this.exec.push({ obj: result, data: payload });
            if (!this.started) {
                this.started = true;
                this.execute();
            }
            return this;
        } else {
            throw new Error('Event not found');
        }
    }

    public initial(state: State) {
        this.current = state;
        return this;
    }

    public from(state: State, ...rules: OnClass[]) {
        const result = this.states.find((ev: State) => ev.id === state.id);
        if (!result) {
            this.states.push(state);
        }
        rules.forEach((rule) => {
           const event = rule.event;
           event.from = state;
            const result = this.events.find((ev: Event) => ev.id === event.id);
            if (result) {
                throw new Error('Duplicated ')
            } else {
                this.events.push(event);
            }
        });
        return this;
    }

    public get(): Promise<any> {
        return wait(0.001)().then(() => {
            if (!this.started) {
                return this.current.payload;
            } else {
                return this.get();
            }
        });
    }

    public withLogging(f?: any) {
        this.log = true;
        this.logF = f;
        return this;
    }
}