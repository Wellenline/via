"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hello = void 0;
const http_1 = require("../../http");
const base_1 = require("./base");
let Hello = class Hello extends base_1.BaseClass {
    constructor() {
        super();
        console.log("hello");
    }
    async doSome() {
        this.increment();
        return {
            say: this.doSomething(),
            count: this.counter,
        };
    }
    async world() {
        console.log(this.counter);
        return {
            hello: 1,
            counter: this.counter,
        };
    }
};
__decorate([
    http_1.Get("/")
], Hello.prototype, "doSome", null);
__decorate([
    http_1.Get("/world")
], Hello.prototype, "world", null);
Hello = __decorate([
    http_1.Resource("/hello", { version: "v1" })
], Hello);
exports.Hello = Hello;
