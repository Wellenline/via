"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpException = exports.CustomErrorHandler = exports.Context = exports.Options = exports.Head = exports.Mixed = exports.Delete = exports.Patch = exports.Put = exports.Post = exports.Get = exports.Params = exports.Route = exports.Before = exports.Resource = exports.bootstrap = exports.app = exports.Constants = exports.HttpMethodsEnum = exports.HttpStatus = void 0;
const http_1 = require("http");
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
    HttpMethodsEnum["GET"] = "GET";
    HttpMethodsEnum["POST"] = "POST";
    HttpMethodsEnum["PUT"] = "PUT";
    HttpMethodsEnum["DELETE"] = "DELETE";
    HttpMethodsEnum["PATCH"] = "PATCH";
    HttpMethodsEnum["MIXED"] = "MIXED";
    HttpMethodsEnum["HEAD"] = "HEAD";
    HttpMethodsEnum["OPTIONS"] = "OPTIONS";
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
    base: "http://via.local",
    middleware: [],
    next: false,
    logs: false,
    routes: [],
    resources: [],
    instances: [],
};
const decorators = {
    route: [],
    param: [],
    middleware: [],
};
const bootstrap = (options) => {
    if (options.middleware) {
        exports.app.middleware = options.middleware;
    }
    if (options.resources) {
        exports.app.resources = options.resources;
    }
    if (options.base) {
        exports.app.base = options.base;
    }
    if (options.logs) {
        exports.app.logs = options.logs;
    }
    exports.app.server = (0, http_1.createServer)(onRequest).listen(options.port);
};
exports.bootstrap = bootstrap;
/**
 * Convert path to regex
 * @param str string
 * @returns new RegExp
 */
const regexify = (str) => {
    const parts = str.split("/");
    parts.shift();
    const pattern = parts.map((part) => {
        if (part.startsWith("*")) {
            return `/(.*)`;
        }
        else if (part.startsWith(":")) {
            if (part.endsWith("?")) {
                return `(?:/([^/]+?))?`;
            }
            return `/([^/]+?)`;
        }
        return `/${part}`;
    });
    return {
        pattern: new RegExp(`^${pattern.join("")}/?$`, "i"),
    };
};
/**
 * Resource decorator
 * @param path route path
 */
const Resource = (path = "", options) => {
    return (target) => {
        const resource_before = [];
        const resource = decorators.middleware.find((m) => m.resource && m.target === target);
        if (resource && resource.middleware) {
            resource_before.push(...resource.middleware); // = middleware.concat(resource.middleware);
        }
        const routes = decorators.route.filter((route) => route.target === target);
        exports.app.routes = exports.app.routes.concat(routes.map((route) => {
            const func = decorators.middleware.find((m) => m.descriptor && m.descriptor.value === route.descriptor.value && m.target === route.target);
            const params = decorators.param.filter((m) => route.name === m.name && m.target === route.target);
            const route_before = [];
            if (func && func.middleware) {
                route_before.push(...func.middleware); // = middleware.concat(func.middleware);
            }
            if (!exports.app.instances[route.target]) {
                exports.app.instances[route.target] = new route.target();
            }
            return {
                target: route.target,
                fn: route.descriptor.value.bind(exports.app.instances[route.target]),
                path: options && options.version ? "/" + options.version + path + route.path : path + route.path,
                middleware: resource_before.concat(route_before),
                params,
                name: route.name,
                method: route.method,
            };
        }));
    };
};
exports.Resource = Resource;
// Decorators
const Before = (...middleware) => {
    return (target, name, descriptor) => {
        decorators.middleware.push({ middleware, resource: descriptor ? false : true, descriptor, target: descriptor ? target.constructor : target });
    };
};
exports.Before = Before;
/**
 * @Route Decorator
 * @param method HttpMethodsEnum
 * @param path Route path
 */
const Route = (method, path, middleware) => (target, name, descriptor) => {
    decorators.route.push({ method, path, name, middleware, descriptor, target: target.constructor });
};
exports.Route = Route;
const Params = (fn) => (target, name, index) => decorators.param.push({ index, name, fn, target: target.constructor });
exports.Params = Params;
const Get = (path) => (0, exports.Route)(HttpMethodsEnum.GET, path);
exports.Get = Get;
const Post = (path) => (0, exports.Route)(HttpMethodsEnum.POST, path);
exports.Post = Post;
const Put = (path) => (0, exports.Route)(HttpMethodsEnum.PUT, path);
exports.Put = Put;
const Patch = (path) => (0, exports.Route)(HttpMethodsEnum.PATCH, path);
exports.Patch = Patch;
const Delete = (path) => (0, exports.Route)(HttpMethodsEnum.DELETE, path);
exports.Delete = Delete;
const Mixed = (path) => (0, exports.Route)(HttpMethodsEnum.MIXED, path);
exports.Mixed = Mixed;
const Head = (path) => (0, exports.Route)(HttpMethodsEnum.HEAD, path);
exports.Head = Head;
const Options = (path) => (0, exports.Route)(HttpMethodsEnum.OPTIONS, path);
exports.Options = Options;
const Context = (key) => (0, exports.Params)((req) => !key ? req.context : req.context[key]);
exports.Context = Context;
/**
 * Request handler
 * @param req Request
 * @param res Response
 */
const onRequest = async (req, res) => {
    try {
        req.params = {};
        req.parsed = new URL(req.url, exports.app.base);
        exports.app.next = true;
        req.route = getRoute(req);
        req.params = decodeValues(req.params);
        req.query = decodeValues(Object.fromEntries(req.parsed.searchParams));
        req.context = {
            status: HttpStatus.OK,
            headers: exports.app.headers,
            params: req.params,
            route: req.route,
            query: req.query,
            req,
            res,
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
        if (exports.app.logs) {
            console.error(e);
        }
        res.writeHead(e.status || HttpStatus.INTERNAL_SERVER_ERROR, { ...exports.app.headers, ...e.headers });
        res.write(JSON.stringify({
            message: e.message,
            statusCode: e.status,
        }));
        res.end();
    }
};
/**
 * Run middleware
 * @param list
 * @param context
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
        const { pathname } = new URL(req.url, exports.app.base);
        const keys = [];
        const regex = /:([^\/?]+)\??/g;
        route.path = route.path.endsWith("/") && route.path.length > 1 ? route.path.slice(0, -1) : route.path;
        let params = regex.exec(route.path);
        while (params !== null) {
            keys.push(params[1]);
            params = regex.exec(route.path);
        }
        const path = route.path.replace(/\/{1,}/g, "/");
        const { pattern } = regexify(path);
        const matches = pathname.match(pattern);
        if (matches && (route.method === req.method
            || route.method === HttpMethodsEnum.MIXED)) {
            req.params = Object.assign(req.params, keys.reduce((val, key, index) => {
                val[key] = matches[index + 1];
                return val;
            }, {}));
            return true;
        }
    });
};
const args = (req) => {
    const ARGS = [];
    if (req.route.params) {
        req.route.params.sort((a, b) => a.index - b.index);
        for (const param of req.route.params) {
            ARGS.push(param ? param.fn(req) : undefined);
        }
    }
    return ARGS;
};
/**
 * Decode values
 * @param obj parameter values
 */
const decodeValues = (obj) => {
    /*const decoded: { [x: string]: number | boolean | string } = {};
    for (const key of Object.keys(obj)) {
        decoded[key] = !isNaN(parseFloat(obj[key])) && isFinite(obj[key]) && !(Number.isSafeInteger(obj[key])) ?
            (Number.isInteger(obj[key]) ? Number.parseInt(obj[key], 10) :
                Number.parseFloat(obj[key])) : obj[key];
    }
    return decoded;*/
    const decodedValues = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        // Check if the value is a number
        const isNumeric = !isNaN(parseFloat(value)) && isFinite(value);
        if (isNumeric) {
            // Parse the number based on its type
            if (!Number.isSafeInteger(Number(value))) {
                decodedValues[key] = value.toString();
            }
            else if (Number.isInteger(value)) {
                decodedValues[key] = Number.parseInt(value, 10);
            }
            else {
                decodedValues[key] = Number.parseFloat(value);
            }
        }
        else {
            // Keep the original value if it's not a number
            decodedValues[key] = value;
        }
    }
    return decodedValues;
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
    typeof obj === "object" && !Buffer.isBuffer(obj);
/**
 * Check if obj is readable
 * @param obj any
 */
const isReadable = (obj) => isStream(obj) &&
    typeof obj._read === "function" &&
    typeof obj._readableState === "object" || obj.readable;
/**
 * Resolve request
 * @param context request context
 */
const resolve = (context) => {
    if (context.redirect) {
        context.res.writeHead(context.status, { Location: context.redirect });
        return context.res.end();
    }
    context.res.writeHead(context.status, Object.assign({}, exports.app.headers, context.headers));
    if (isReadable(context.res.body)) {
        return context.res.body.pipe(context.res);
    }
    if (isObject(context.res.body)) {
        return context.res.end(JSON.stringify(context.res.body));
    }
    context.res.end(context.res.body || "");
};
class CustomErrorHandler extends Error {
}
exports.CustomErrorHandler = CustomErrorHandler;
/**
 * HttpException error
 */
class HttpException extends CustomErrorHandler {
    constructor(message, status = HttpStatus.INTERNAL_SERVER_ERROR, headers) {
        super(message);
        this.status = status;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status;
        if (headers) {
            this.headers = headers;
        }
    }
}
exports.HttpException = HttpException;
