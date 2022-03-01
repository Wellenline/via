"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClass = void 0;
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
