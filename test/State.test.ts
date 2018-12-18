import {suite, test} from 'mocha-typescript';
import State from "../src/State";
import * as assert from "assert";

@suite
class StateTest {

    @test
    with() {
        const state = new State();
        state.with(4);
        assert.deepStrictEqual(state.payload, 4, "Expected payload to equal four.");
    }
}