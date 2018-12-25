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
    .with({ rub: 1000, time: 1000 })
    .withLogging((from: State, to: State, event: Event, data: any, resources: { rub: number, time: number }) =>
        `${from.name} -> ${to.name} in ${event.id} with new payload ${data} and remained resources: ${JSON.stringify(resources)}`)
    .from(A.with(10),
        on<number, number, number>(eventA)
            .to(B)
            .data((dataA: number, dataEventA: number, resources: { rub: number, time: number }) => {
                resources.time += 100;
                return dataA + dataEventA;
            })
            .post(async () => { await wait(2)(); console.log('post callback!'); }))
            // .annotate({ monotonous: true })))
    .from(B.with(20),
        on(eventB).to(C),
        on<number, number, number>(eventC).to(A)
            .pre(wait(1))
            .cost({ time: 200, rub: 300 })
            .data((dataB: number, dataEventC: number) => dataB + dataEventC)
            // .annotate({ monotonous: true })
    );

void async function() {
    const valid = await fsm.check([
        eventA.with(30),
        eventC.with(20),
    ]);
    if (valid) {
        fsm.emit(eventA, 30);
        fsm.emit(eventC, 20);
        const result = await fsm.get();
        console.log(result);
    } else {
        console.log('Not a valid operation.');
    }
}();
