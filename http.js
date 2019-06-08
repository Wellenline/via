"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const http_1 = require("http");
require("reflect-metadata");
const url_1 = require("url");
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["CONTINUE"] = 100] = "CONTINUE";
    HttpStatus[HttpStatus["SWITCHING_PROTOCOLS"] = 101] = "SWITCHING_PROTOCOLS";
    HttpStatus[HttpStatus["PROCESSING"] = 102] = "PROCESSING";
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["ACCEPTED"] = 202] = "ACCEPTED";
    HttpStatus[HttpStatus["NON_AUTHORITATIVE_INFORMATION"] = 203] = "NON_AUTHORITATIVE_INFORMATION";
    HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatus[HttpStatus["RESET_CONTENT"] = 205] = "RESET_CONTENT";
    HttpStatus[HttpStatus["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    HttpStatus[HttpStatus["AMBIGUOUS"] = 300] = "AMBIGUOUS";
    HttpStatus[HttpStatus["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    HttpStatus[HttpStatus["FOUND"] = 302] = "FOUND";
    HttpStatus[HttpStatus["SEE_OTHER"] = 303] = "SEE_OTHER";
    HttpStatus[HttpStatus["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    HttpStatus[HttpStatus["TEMPORARY_REDIRECT"] = 307] = "TEMPORARY_REDIRECT";
    HttpStatus[HttpStatus["PERMANENT_REDIRECT"] = 308] = "PERMANENT_REDIRECT";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["PAYMENT_REQUIRED"] = 402] = "PAYMENT_REQUIRED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpStatus[HttpStatus["NOT_ACCEPTABLE"] = 406] = "NOT_ACCEPTABLE";
    HttpStatus[HttpStatus["PROXY_AUTHENTICATION_REQUIRED"] = 407] = "PROXY_AUTHENTICATION_REQUIRED";
    HttpStatus[HttpStatus["REQUEST_TIMEOUT"] = 408] = "REQUEST_TIMEOUT";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["GONE"] = 410] = "GONE";
    HttpStatus[HttpStatus["LENGTH_REQUIRED"] = 411] = "LENGTH_REQUIRED";
    HttpStatus[HttpStatus["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    HttpStatus[HttpStatus["PAYLOAD_TOO_LARGE"] = 413] = "PAYLOAD_TOO_LARGE";
    HttpStatus[HttpStatus["URI_TOO_LONG"] = 414] = "URI_TOO_LONG";
    HttpStatus[HttpStatus["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    HttpStatus[HttpStatus["REQUESTED_RANGE_NOT_SATISFIABLE"] = 416] = "REQUESTED_RANGE_NOT_SATISFIABLE";
    HttpStatus[HttpStatus["EXPECTATION_FAILED"] = 417] = "EXPECTATION_FAILED";
    HttpStatus[HttpStatus["I_AM_A_TEAPOT"] = 418] = "I_AM_A_TEAPOT";
    HttpStatus[HttpStatus["UNPROCESSABLE_ENTITY"] = 422] = "UNPROCESSABLE_ENTITY";
    HttpStatus[HttpStatus["TOO_MANY_REQUESTS"] = 429] = "TOO_MANY_REQUESTS";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HttpStatus[HttpStatus["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    HttpStatus[HttpStatus["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HttpStatus[HttpStatus["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
})(HttpStatus = exports.HttpStatus || (exports.HttpStatus = {}));
var HttpMethodsEnum;
(function (HttpMethodsEnum) {
    HttpMethodsEnum[HttpMethodsEnum["GET"] = 0] = "GET";
    HttpMethodsEnum[HttpMethodsEnum["POST"] = 1] = "POST";
    HttpMethodsEnum[HttpMethodsEnum["PUT"] = 2] = "PUT";
    HttpMethodsEnum[HttpMethodsEnum["DELETE"] = 3] = "DELETE";
    HttpMethodsEnum[HttpMethodsEnum["PATCH"] = 4] = "PATCH";
    HttpMethodsEnum[HttpMethodsEnum["MIXED"] = 5] = "MIXED";
    HttpMethodsEnum[HttpMethodsEnum["HEAD"] = 6] = "HEAD";
    HttpMethodsEnum[HttpMethodsEnum["OPTIONS"] = 7] = "OPTIONS";
})(HttpMethodsEnum = exports.HttpMethodsEnum || (exports.HttpMethodsEnum = {}));
var Constants;
(function (Constants) {
    Constants["INVALID_ROUTE"] = "Invalid route";
    Constants["NO_RESPONSE"] = "No response";
    Constants["ROUTE_DATA"] = "__route_data__";
    Constants["ROUTE_MIDDLEWARE"] = "__route_middleware__";
    Constants["ROUTE_PARAMS"] = "__route_params__";
})(Constants = exports.Constants || (exports.Constants = {}));
exports.app = {
    headers: {
        "Content-type": "application/json",
    },
    middleware: [],
    next: false,
    routes: [],
};
exports.bootstrap = (options) => {
    if (options.middleware) {
        exports.app.middleware = options.middleware;
    }
    if (options.autoload) {
        fs.readdirSync(options.autoload).map((file) => {
            if (file.endsWith(".js")) {
                require(options.autoload + "/" + file.replace(/\.[^.$]+$/, ""));
            }
        });
    }
    exports.app.server = http_1.createServer(onRequest).listen(options.port);
    // http2.createSecureServer(options.http2, onRequest).listen(options.port);
};
/**
 * Resource decorator
 * @param path route path
 */
exports.Resource = (path = "") => (target) => {
    const resourceMiddleware = Reflect.getMetadata(Constants.ROUTE_MIDDLEWARE, target) || [];
    const routes = Reflect.getMetadata(Constants.ROUTE_DATA, target.prototype) || [];
    exports.app.routes = exports.app.routes.concat(routes.map((route) => {
        const middleware = Reflect.getMetadata(Constants.ROUTE_MIDDLEWARE + route.name, target.prototype) || [];
        const params = Reflect.getMetadata(Constants.ROUTE_PARAMS + route.name, target.prototype) || [];
        return {
            fn: route.descriptor.value,
            method: route.method,
            middleware: [...resourceMiddleware, ...middleware],
            name: route.name,
            params,
            path: path + route.path,
        };
    }));
    Reflect.defineMetadata(Constants.ROUTE_DATA, exports.app.routes, target);
};
// Decorators
/**
 * Route/Resource middleware
 * @param middleware
 */
exports.Use = (...middleware) => (target, propertyKey) => {
    Reflect.defineMetadata(Constants.ROUTE_MIDDLEWARE + (propertyKey ? propertyKey : ""), middleware, target);
};
/**
 * @Route Decorator
 * @param method HttpMethodsEnum
 * @param path Route path
 */
exports.Route = (method, path) => (target, name, descriptor) => {
    const meta = Reflect.getMetadata(Constants.ROUTE_DATA, target) || [];
    meta.push({ method, path, name, descriptor });
    Reflect.defineMetadata(Constants.ROUTE_DATA, meta, target);
};
/**
 * @Get Decorator
 * @param path Get path
 */
exports.Get = (path) => exports.Route(HttpMethodsEnum.GET, path);
/**
 * @Get Decorator
 * @param path Get path
 */
exports.Post = (path) => exports.Route(HttpMethodsEnum.POST, path);
/**
 * @Get Decorator
 * @param path Get path
 */
exports.Put = (path) => exports.Route(HttpMethodsEnum.PUT, path);
/**
 * @Get Decorator
 * @param path Get path
 */
exports.Patch = (path) => exports.Route(HttpMethodsEnum.PATCH, path);
/**
 * @Get Decorator
 * @param path Get path
 */
exports.Delete = (path) => exports.Route(HttpMethodsEnum.DELETE, path);
/**
 * @Get Decorator
 * @param path Get path
 */
exports.Mixed = (path) => exports.Route(HttpMethodsEnum.MIXED, path);
/**
 * @Get Decorator
 * @param path Get path
 */
exports.Head = (path) => exports.Route(HttpMethodsEnum.HEAD, path);
/**
 * @Get Decorator
 * @param path Get path
 */
exports.Options = (path) => exports.Route(HttpMethodsEnum.OPTIONS, path);
/**
 * Get request parameters
 * @param key optional key to lookup
 */
exports.Param = (key) => decorate((req) => !key ? req.params : req.params[key]);
/**
 * Get request query parameters
 * @param key optional key to lookup
 */
exports.Query = (key) => decorate((req) => !key ? req.query : req.query[key]);
/**
 * Get POST request body
 * @param key optional key to lookup
 */
exports.Body = (key) => decorate((req) => !key ? req.body : req.body[key]);
/**
 * Route context
 * @param key optional key to lookup
 */
exports.Context = (key) => decorate((req) => !key ? req.context : req.context[key]);
/**
 * Request handler
 * @param req Request
 * @param res Response
 */
const onRequest = async (req, res) => {
    try {
        req.params = {};
        req.parsed = url_1.parse(req.url, true);
        exports.app.next = true;
        req.route = getRoute(req);
        req.params = decodeValues(req.params);
        req.query = decodeValues(req.parsed.query);
        req.context = {
            headers: exports.app.headers,
            req,
            res,
            status: HttpStatus.OK,
        };
        if (exports.app.middleware.length > 0) {
            await execute(exports.app.middleware, req.context);
        }
        if (!req.route) {
            throw new HttpException(Constants.INVALID_ROUTE, HttpStatus.NOT_FOUND);
        }
        if (req.route.middleware && exports.app.next) {
            await execute(req.route.middleware, req.context);
        }
        if (!exports.app.next) {
            return;
        }
        req.context.res.body = await req.route.fn(...args(req));
        resolve(req.context);
    }
    catch (e) {
        res.writeHead(e.status || HttpStatus.INTERNAL_SERVER_ERROR, exports.app.headers);
        res.write(JSON.stringify({
            message: e.message,
            statusCode: e.status,
        }));
        res.end();
    }
};
/**
 * Get decorated arguments
 * @param req Request
 */
const args = (req) => {
    const pArgs = [];
    if (req.route.params) {
        req.route.params.sort((a, b) => a.index - b.index);
        for (const param of req.route.params) {
            let result;
            if (param !== undefined) {
                result = param.fn(req);
            }
            pArgs.push(result);
        }
    }
    return pArgs;
};
/**
 * Run middleware
 * @param list
 * @param req
 * @param res
 */
const execute = async (list, context) => {
    for (const fn of list) {
        exports.app.next = false;
        if (fn instanceof Function) {
            const result = await fn(context);
            if (!result) {
                break;
            }
            exports.app.next = true;
        }
    }
};
/**
 * Find route and match params
 * @param req Request
 */
const getRoute = (req) => {
    return exports.app.routes.find((route) => {
        const match = /^(.*)\?.*#.*|(.*)(?=[?#])|(.*[^?#])$/.exec(req.url);
        const base = match[1] || match[2] || match[3];
        const keys = [];
        const regex = /:([^\/?]+)\??/g;
        route.path = route.path.endsWith("/") ? route.path.slice(0, -1) : route.path;
        let params = regex.exec(route.path);
        while (params !== null) {
            keys.push(params[1]);
            params = regex.exec(route.path);
        }
        const path = route.path
            .replace(/\/:[^\/]+\?/g, "(?:\/([^\/]+))?")
            .replace(/:[^\/]+/g, "([^\/]+)")
            .replace("/", "\\/");
        const matches = base.match(new RegExp(`^${path}$`));
        if (matches && (route.method === Object(HttpMethodsEnum)[req.method]
            || route.method === HttpMethodsEnum.MIXED)) {
            req.params = Object.assign(req.params, keys.reduce((val, key, index) => {
                val[key] = matches[index + 1];
                return val;
            }, {}));
            return true;
        }
    });
};
/**
 * Decorate
 * @param fn
 */
const decorate = (fn) => {
    return (target, name, index) => {
        const meta = Reflect.getMetadata(Constants.ROUTE_PARAMS + name, target) || [];
        meta.push({ index, name, fn });
        Reflect.defineMetadata(Constants.ROUTE_PARAMS + name, meta, target);
    };
};
/**
 * Decode values
 * @param object parameter values
 */
const decodeValues = (obj) => {
    const decoded = {};
    for (const key of Object.keys(obj)) {
        decoded[key] = !isNaN(parseFloat(obj[key])) && isFinite(obj[key]) ?
            (Number.isInteger(obj[key]) ? Number.parseInt(obj[key], 10) :
                Number.parseFloat(obj[key])) : obj[key];
    }
    return decoded;
};
/**
 * Check if obj is stream
 * @param obj any
 */
const isStream = (obj) => obj &&
    typeof obj === "object" &&
    typeof obj.pipe === "function";
/**
 * Check if obj is object
 * @param obj any
 */
const isObject = (obj) => obj &&
    typeof obj === "object";
/**
 * Check if obj is readable
 * @param obj any
 */
const isReadable = (obj) => isStream(obj) &&
    typeof obj._read === "function" &&
    typeof obj._readableState === "object";
/**
 * Resolve request
 * @param context request context
 */
const resolve = (context) => {
    context.res.writeHead(context.status, Object.assign({}, exports.app.headers, context.headers));
    if (isReadable(context.res.body)) {
        return context.res.body.pipe(context.res);
    }
    if (isObject(context.res.body)) {
        return context.res.end(JSON.stringify(context.res.body));
    }
    context.res.end(context.res.body || "");
};
/**
 * HttpException error
 */
class HttpException extends Error {
    constructor(message, status = HttpStatus.INTERNAL_SERVER_ERROR) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status;
    }
}
exports.HttpException = HttpException;
