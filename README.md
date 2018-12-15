# fsm-ts
Finite State Machine for TypeScript

```typescript
import {FSM, on, wait, State } from 'fsm-ts';

const fsm = FSM()
    .initial(A)
    .with({ rub: 1000, time: 1000 })
    .withLogging((from: State, to: State, event: Event, data: any, resources: { rub: number, time: number }) =>
        `${from.name} -> ${to.name} in ${event.id} with new payload 
        ${data} and remained resources: ${JSON.stringify(resources)}`)
    .from(A.with(10),
        on<number, number, number>(eventA)
            .to(B)
            .data((dataA: number, dataEventA: number, resources: { rub: number, time: number }) => {
                resources.time -= 100;
                return dataA + dataEventA;
            })
            .post(async () => { await wait(2)(); console.log('post callback!'); }))
            // .annotate({ monotonous: true })))
    .from(B.with(20),
        on(eventB).to(C),
        on<number, number, number>(eventC).to(A)
            .pre(wait(1))
            .cost({ time: 10, rub: 300 })
            .data((dataB: number, dataEventC: number) => dataB + dataEventC)
            // .annotate({ monotonous: true })
    );


void async function() {
    const valid = await fsm.check([ eventA, eventC, eventA, eventC ]);
    if (valid) {
        const res = await fsm.emit(eventA, 20).emit(eventC, 30).get();
        console.log(res);

        fsm.emit(eventA, 30);
        fsm.emit(eventC, 20);
        const result = await fsm.get();
        console.log(result);
    } else {
        console.log('Not a valid operation.');
    }
}();
```
