# fsm-ts
Finite State Machine for TypeScript

```typescript
import {FSM, on, wait } from 'fsm-ts';

const fsm = FSM()
    .initial(A)
    .withLogging((from: State, to: State, event: Event, data: any) =>
        `${from.name} -> ${to.name} in ${event.id} with new payload ${data}`)
    .from(A.with(10),
        on(eventA)
            // .pre(wait(5))
            .to(B)
            .data((dataA: any, dataEventA: any) => dataA + dataEventA)
            // .post(wait(1))
    )
    .from(B.with(20),
        on(eventB).to(C),
        on(eventC).to(A).pre(wait(1)).data((dataB: any, dataEventC: any) => dataB + dataEventC)
    );

void async function() {
    const res = await fsm.emit(eventA, 20).emit(eventC, 30).get();
    console.log(res);
}();
```
