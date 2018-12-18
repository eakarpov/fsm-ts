import {suite, test} from 'mocha-typescript';
import State from "../src/State";
import Event from '../src/Event';
import * as assert from "assert";
import {OnClass} from "../src/on";

@suite
class OnTest {

    @test
    to() {
        const state = new State();
        const event = new Event();
        const on = new OnClass(event);
        on.to(state);
        assert.deepStrictEqual(on.event.to, state, "Expected state TO to equal the given one.");
    }
}