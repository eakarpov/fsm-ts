import FSM from "../src/FSM";
import State from "../src/State";
import Event from "../src/Event";

const A = new State();
const B = new State();
const C = new State();

const eventA = new class extends Event {
    public async dispatch(): Promise<State> {
        console.log(4);
        return super.dispatch();
    }
}(A, C);

new FSM()
    .addState(A)
    .addState(B)
    .addState(C)
    .addEvent(eventA)
    .initial(A)
    .emit(eventA);
