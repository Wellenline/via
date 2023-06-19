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
exports.Query = void 0;
const http_1 = require("../../http");
let Query = class Query {
    async index(context) {
        return {
            queryParams: context.query,
        };
    }
};
__decorate([
    (0, http_1.Get)("/"),
    __param(0, (0, http_1.Context)())
], Query.prototype, "index", null);
Query = __decorate([
    (0, http_1.Resource)("/query")
], Query);
exports.Query = Query;
