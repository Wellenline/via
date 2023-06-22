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
exports.Errors = void 0;
const http_1 = require("../../http");
let Errors = class Errors {
    async error(context) {
        throw new http_1.HttpException("Teapot", http_1.HttpStatus.I_AM_A_TEAPOT);
    }
    async headers(context) {
        throw new http_1.HttpException("Custom error", http_1.HttpStatus.INTERNAL_SERVER_ERROR, {
            "X-Custom-Header": "Custom Value",
        });
    }
    async header(context) {
        throw new http_1.HttpException("Custom error updated", http_1.HttpStatus.INTERNAL_SERVER_ERROR, {
            "X-Custom-Header": "Custom Value Updated",
        });
    }
    async unhandled(context) {
        o.p = 1;
        return "unhandled";
    }
};
__decorate([
    (0, http_1.Get)("/"),
    __param(0, (0, http_1.Context)())
], Errors.prototype, "error", null);
__decorate([
    (0, http_1.Get)("/headers"),
    __param(0, (0, http_1.Context)())
], Errors.prototype, "headers", null);
__decorate([
    (0, http_1.Get)("/header"),
    __param(0, (0, http_1.Context)())
], Errors.prototype, "header", null);
__decorate([
    (0, http_1.Get)("/unhandled"),
    __param(0, (0, http_1.Context)())
], Errors.prototype, "unhandled", null);
Errors = __decorate([
    (0, http_1.Resource)("/errors")
], Errors);
exports.Errors = Errors;
