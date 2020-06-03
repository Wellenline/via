"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseClass {
    constructor() {
        this.counter = 250;
    }
    doSomething() {
        return "I can do anything!";
    }
    increment() {
        this.counter++;
    }
}
exports.BaseClass = BaseClass;
