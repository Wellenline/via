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
const http_1 = require("../../http");
let Redirect = class Redirect {
    async world(context) {
        context.redirect = "https://google.com";
    }
};
__decorate([
    http_1.Get("/"),
    __param(0, http_1.Context())
], Redirect.prototype, "world", null);
Redirect = __decorate([
    http_1.Resource("/redirect", { version: "v1" })
], Redirect);
exports.Redirect = Redirect;
