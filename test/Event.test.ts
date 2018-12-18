import {suite, test} from 'mocha-typescript';
import Event from "../src/Event";
import * as assert from "assert";

@suite
class EventTest {

    @test
    with() {
        const state = new Event();
        state.with(4);
        assert.deepStrictEqual(state.payload, 4, "Expected payload to equal four.");
    }
}