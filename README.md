# fsm-ts
Finite State Machine for TypeScript

```typescript
import {FSM, on, wait, log } from 'fsm-ts';

FSM
    .initial(A)
    .from<T>(A, 
        on<K>(eventA)
            .pre(wait(5000))
            .to(C)
            .data((dataA: T, dataEventA: K) => dataA + dataEventA)
            .post(log)
    )
    .from(B,
        on(eventB).to(C),
        on(eventC).to(A).withLogging()
    );
```
