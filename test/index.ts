import FSM from "../src/FSM";
import State from "../src/State";
import Event from "../src/Event";
import {on, wait} from "../src";

const A = new State<number>('a');
const B = new State<number>('b');
const C = new State<number>('c');

const eventA = new class extends Event<number> {
    public async dispatch(): Promise<State> {
        console.log('event A');
        return super.dispatch();
    }
};

const eventB = new Event<number>();
const eventC = new Event<number>();

const fsm = FSM()
    .initial(A)
    .withLogging((from: State, to: State, event: Event, data: any) =>
        `${from.name} -> ${to.name} in ${event.id} with new payload ${data}`)
    .from(A.with(10),
        on<number, number, number>(eventA)
            .to(B)
            .data((dataA: number, dataEventA: number) => dataA + dataEventA)
            .post(async () => { await wait(2)(); console.log('post callback!'); }))
            // .annotate({ monotonous: true })))
    .from(B.with(20),
        on(eventB).to(C),
        on<number, number, number>(eventC).to(A)
            .pre(wait(1))
            .data((dataB: number, dataEventC: number) => dataB + dataEventC)
            // .annotate({ monotonous: true })
    );


void async function() {
    const res = await fsm.emit(eventA, 20).emit(eventC, 30).get();
    console.log(res);

    fsm.emit(eventA, 30);
    // await wait(2);
    fsm.emit(eventC, 20);
    const result = await fsm.get();
    console.log(result);
}();
