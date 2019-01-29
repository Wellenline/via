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
const liquid_1 = require("../liquid");
const fs = require("fs");
const querystring_1 = require("querystring");
const middleware_1 = (req, res, next) => {
    req.query.middleware_1 = true;
    setTimeout(() => {
        next({ secret: 1 });
    }, 5000);
};
const middleware_2 = (req, res, next) => {
    req.query.middleware_2 = true;
    next(Object.assign({ middleware_next: 2 }, req.next));
};
const body_parser = (req, res, next) => {
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
        let body = "";
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', () => {
            req.body = querystring_1.parse(body);
            next();
        });
    }
    else {
        next();
    }
};
let Example = class Example {
    constructor() {
        console.log("example init");
    }
    async error(res, error) {
        if (error) {
            throw liquid_1.httpExecption("SomeShit Happened", liquid_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return "Append error query param to trigger httpException";
    }
    async get() {
        return "<h2>Hello</h2> <b>IM a html string</b>";
    }
    async json(req, params, query) {
        return {
            query,
            params,
            next: req.next,
            hello: liquid_1.app
        };
    }
    async stream(res) {
        return fs.readFileSync("./test/logo.png");
    }
    async post(res, body) {
        console.log("posting", body);
        return {
            hel: 1
        };
    }
    async update(res, body) {
        return {
            body,
            "upadting": true
        };
    }
    async patch(res, body) {
        return body;
    }
    async delete(res, body, param) {
        return {
            "DELETING": true,
            param
        };
    }
};
__decorate([
    liquid_1.Get("/error"),
    liquid_1.HttpCode(liquid_1.HttpStatus.INTERNAL_SERVER_ERROR),
    __param(0, liquid_1.Res()), __param(1, liquid_1.Query("error"))
], Example.prototype, "error", null);
__decorate([
    liquid_1.Get("/string"),
    liquid_1.HttpHeaders({
        "Content-type": "text/html"
    })
], Example.prototype, "get", null);
__decorate([
    liquid_1.Get("/json/:id?/hello"),
    liquid_1.HttpCode(liquid_1.HttpStatus.OK),
    liquid_1.Use(middleware_1, middleware_2),
    __param(0, liquid_1.Req()), __param(1, liquid_1.Param()), __param(2, liquid_1.Query())
], Example.prototype, "json", null);
__decorate([
    liquid_1.Get("/stream"),
    liquid_1.HttpCode(200),
    liquid_1.HttpHeaders({
        "Content-type": "image/png"
    }),
    __param(0, liquid_1.Res())
], Example.prototype, "stream", null);
__decorate([
    liquid_1.Post("/post"),
    liquid_1.HttpCode(201),
    __param(0, liquid_1.Res()), __param(1, liquid_1.Body())
], Example.prototype, "post", null);
__decorate([
    liquid_1.Put("/json/:id?/hello"),
    __param(0, liquid_1.Res()), __param(1, liquid_1.Body())
], Example.prototype, "update", null);
__decorate([
    liquid_1.Patch("/patch"),
    __param(0, liquid_1.Res()), __param(1, liquid_1.Body())
], Example.prototype, "patch", null);
__decorate([
    liquid_1.Delete("/json/:id?"),
    __param(0, liquid_1.Res()), __param(1, liquid_1.Body()), __param(2, liquid_1.Param())
], Example.prototype, "delete", null);
Example = __decorate([
    liquid_1.Resource()
], Example);
exports.Example = Example;
let Test = class Test {
    async stream(res) {
        // throw new Error("Failed to process");
        return fs.readFileSync("./test/logo.png");
    }
};
__decorate([
    liquid_1.Get("/stream"),
    liquid_1.HttpHeaders({
    // "Content-type": "image/png"
    }),
    __param(0, liquid_1.Res())
], Test.prototype, "stream", null);
Test = __decorate([
    liquid_1.Resource("/test")
], Test);
exports.Test = Test;
liquid_1.bootstrap({
    port: 3000,
    middleware: [body_parser],
});
