"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.World = void 0;
const http_1 = require("../../http");
let World = class World {
    async hello() {
        return "world";
    }
    async wild(context) {
        return "Im wild";
    }
    async parameters(context) {
        return {
            param1: context.params.param1,
            optional: context.params.optional,
            notoptiona: context.params.notoptional,
        };
    }
};
__decorate([
    http_1.Get("/")
], World.prototype, "hello", null);
__decorate([
    http_1.Get("/wild/*"),
    __param(0, http_1.Context())
], World.prototype, "wild", null);
__decorate([
    http_1.Get("/:param1/:optional?/:notoptional"),
    __param(0, http_1.Context())
], World.prototype, "parameters", null);
World = __decorate([
    http_1.Resource("/world")
], World);
exports.World = World;
//([\/][^/]+)?
