import * as fs from "fs";
import { createServer, IncomingMessage, OutgoingHttpHeaders, Server, ServerResponse } from "http";

import { parse } from "url";

export enum HttpStatus {
	CONTINUE = 100,
	SWITCHING_PROTOCOLS = 101,
	PROCESSING = 102,
	OK = 200,
	CREATED = 201,
	ACCEPTED = 202,
	NON_AUTHORITATIVE_INFORMATION = 203,
	NO_CONTENT = 204,
	RESET_CONTENT = 205,
	PARTIAL_CONTENT = 206,
	AMBIGUOUS = 300,
	MOVED_PERMANENTLY = 301,
	FOUND = 302,
	SEE_OTHER = 303,
	NOT_MODIFIED = 304,
	TEMPORARY_REDIRECT = 307,
	PERMANENT_REDIRECT = 308,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	PAYMENT_REQUIRED = 402,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,
	NOT_ACCEPTABLE = 406,
	PROXY_AUTHENTICATION_REQUIRED = 407,
	REQUEST_TIMEOUT = 408,
	CONFLICT = 409,
	GONE = 410,
	LENGTH_REQUIRED = 411,
	PRECONDITION_FAILED = 412,
	PAYLOAD_TOO_LARGE = 413,
	URI_TOO_LONG = 414,
	UNSUPPORTED_MEDIA_TYPE = 415,
	REQUESTED_RANGE_NOT_SATISFIABLE = 416,
	EXPECTATION_FAILED = 417,
	I_AM_A_TEAPOT = 418,
	UNPROCESSABLE_ENTITY = 422,
	TOO_MANY_REQUESTS = 429,
	INTERNAL_SERVER_ERROR = 500,
	NOT_IMPLEMENTED = 501,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
	GATEWAY_TIMEOUT = 504,
	HTTP_VERSION_NOT_SUPPORTED = 505,
}
export interface IResponse extends ServerResponse {
	body: any;
}
export interface IApp {
	server?: Server;
	routes: IRoute[];
	next: boolean;
	middleware: any[];
	resources: any[];
	instances: any[];
	headers: OutgoingHttpHeaders;
}
export interface IParam {
	index?: number;
	name?: string;
	fn: (req?: IRequest) => void;
}
export interface IRoute {
	method: HttpMethodsEnum;
	path: string;
	name: string;
	middleware: any[];
	params: IParam[];
	fn: any;
	httpStatus: HttpStatus;
	headers: OutgoingHttpHeaders;
}
export interface IRequest extends IncomingMessage {
	query: any;
	body: any;
	payload: any;
	params: any;
	parsed: any;
	files: any;
	next: any;
	route: IRoute;
	response: IResponse;
	request: IRequest;
	context: {
		status: HttpStatus,
		req: IRequest,
		res: IResponse,
		headers: any,
		params: any,
		[key: string]: any;
	};
}
export interface IOptions {
	port: number | string;
	middleware?: any[];
	autoload?: string;
	resources?: any[];
}

export interface IContext {
	req: IRequest;
	res: IResponse;
	headers?: OutgoingHttpHeaders;
	status?: HttpStatus;
	redirect?: string;
	[key: string]: any;
}

export interface IException {
	message?: string;
	error?: any;
	statusCode?: number;
}

export type INext = (data?: object) => void;

export enum HttpMethodsEnum {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
	PATCH = "PATCH",
	MIXED = "MIXED",
	HEAD = "HEAD",
	OPTIONS = "OPTIONS",
}
export enum Constants {
	INVALID_ROUTE = "Invalid route",
	NO_RESPONSE = "No response",
	ROUTE_DATA = "__route_data__",
	ROUTE_MIDDLEWARE = "__route_middleware__",
	ROUTE_PARAMS = "__route_params__",
}

export const app: IApp = {
	headers: {
		"Content-type": "application/json",
	},
	middleware: [],
	next: false,
	routes: [],
	resources: [],
	instances: [],
};

const decorators: any = {
	route: [],
	param: [],
	middleware: [],
};

export const bootstrap = (options: IOptions) => {
	if (options.middleware) {
		app.middleware = options.middleware;
	}

	if (options.resources) {
		app.resources = options.resources;
	}

	app.server = createServer(onRequest).listen(options.port);
};
/**
 * Convert path to regex
 * @param str string
 * @returns new RegExp
 */
const regexify = (str: string) => {
	const parts = str.split("/");
	parts.shift();
	const pattern = parts.map((part) => {
		if (part.startsWith("*")) {
			return `/(.*)`;
		} else if (part.startsWith(":")) {
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
export const Resource = (path: string = "", options?: { version: string }) => {
	return (target: any) => {
		const resource_before: any[] = [];
		const resource = decorators.middleware.find((m: any) => m.resource && m.target === target);

		if (resource && resource.middleware) {
			resource_before.push(...resource.middleware); // = middleware.concat(resource.middleware);
		}
		const routes = decorators.route.filter((route: any) => route.target === target);
		app.routes = app.routes.concat(routes.map((route: any) => {
			const func = decorators.middleware.find((m: any) => m.descriptor && m.descriptor.value === route.descriptor.value && m.target === route.target);
			const params = decorators.param.filter((m: any) => route.name === m.name && m.target === route.target);
			const route_before = [];
			if (func && func.middleware) {
				route_before.push(...func.middleware); // = middleware.concat(func.middleware);
			}

			if (!app.instances[route.target]) {
				app.instances[route.target] = new route.target();
			}

			return {
				target: route.target,
				fn: route.descriptor.value.bind(app.instances[route.target]),
				path: options && options.version ? "/" + options.version + path + route.path : path + route.path,
				middleware: resource_before.concat(route_before),
				params,
				name: route.name,
				method: route.method,
			};
		}));
	};
};

// Decorators
export const Before = (...middleware: any[]) => {
	return (target: any, name?: string, descriptor?: PropertyDescriptor) => {
		decorators.middleware.push({ middleware, resource: descriptor ? false : true, descriptor, target: descriptor ? target.constructor : target });
	};
};

/**
 * @Route Decorator
 * @param method HttpMethodsEnum
 * @param path Route path
 */
export const Route = (method: HttpMethodsEnum, path: string, middleware?: any[]) =>
	(target: object, name: string, descriptor: PropertyDescriptor) => {
		decorators.route.push({ method, path, name, middleware, descriptor, target: target.constructor });
	};

export const Params = (fn: any) => (target: object, name: string, index: number) => decorators.param.push({ index, name, fn, target: target.constructor });

export const Get = (path: string) => Route(HttpMethodsEnum.GET, path);

export const Post = (path: string) => Route(HttpMethodsEnum.POST, path);

export const Put = (path: string) => Route(HttpMethodsEnum.PUT, path);

export const Patch = (path: string) => Route(HttpMethodsEnum.PATCH, path);

export const Delete = (path: string) => Route(HttpMethodsEnum.DELETE, path);

export const Mixed = (path: string) => Route(HttpMethodsEnum.MIXED, path);

export const Head = (path: string) => Route(HttpMethodsEnum.HEAD, path);

export const Options = (path: string) => Route(HttpMethodsEnum.OPTIONS, path);

export const Context = (key?: string) => Params((req: IRequest) => !key ? req.context : req.context[key]);

/**
 * Request handler
 * @param req Request
 * @param res Response
 */
const onRequest = async (req: IRequest, res: IResponse) => {
	try {
		req.params = {};
		req.parsed = parse(req.url, true);
		app.next = true;
		req.route = getRoute(req);
		req.params = decodeValues(req.params);
		req.query = decodeValues(req.parsed.query);

		req.context = {
			status: HttpStatus.OK,
			headers: app.headers,
			params: req.params,
			route: req.route,
			query: req.query,
			req,
			res,
		};

		if (app.middleware.length > 0) {
			await execute(app.middleware, req.context);
		}

		if (!req.route) {
			throw new HttpException(Constants.INVALID_ROUTE, HttpStatus.NOT_FOUND);
		}
		if (req.route.middleware && app.next) {
			await execute(req.route.middleware, req.context);
		}

		if (!app.next) {
			return;
		}

		req.context.res.body = await req.route.fn(...args(req));

		resolve(req.context);

	} catch (e) {
		res.writeHead(e.status || HttpStatus.INTERNAL_SERVER_ERROR, app.headers);
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
const execute = async (list: any[], context: IContext) => {
	for (const fn of list) {
		app.next = false;
		if (fn instanceof Function) {
			const result = await fn(context);
			if (!result) {
				break;
			}
			app.next = true;
		}
	}
};

/**
 * Find route and match params
 * @param req Request
 */
const getRoute = (req: IRequest) => {
	return app.routes.find((route) => {
		const match = /^(.*)\?.*#.*|(.*)(?=[?#])|(.*[^?#])$/.exec(req.url);

		const base = match[1] || match[2] || match[3];

		const keys = [];
		const regex = /:([^\/?]+)\??/g;
		route.path = route.path.endsWith("/") && route.path.length > 1 ? route.path.slice(0, -1) : route.path;

		let params = regex.exec(route.path);
		while (params !== null) {
			keys.push(params[1]);
			params = regex.exec(route.path);
		}

		/*const path = route.path
			.replace(/\/:[^\/]+\?/g, "(?:\/([^\/]+))?")
			.replace(/:[^\/]+/g, "([^\/]+)")
			.replace("/", "\\/");*/

		const path = route.path.replace(/\/{1,}/g, "/");
		const { pattern } = regexify(path);
		const matches = base.match(pattern);

		if (matches && (route.method === req.method
			|| route.method === HttpMethodsEnum.MIXED)) {

			req.params = Object.assign(req.params, keys.reduce((val: any, key, index) => {
				val[key] = matches[index + 1];
				return val;
			}, {}));

			return true;
		}
	});
};

const args = (req: IRequest) => {
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
const decodeValues = (obj: any) => {
	const decoded: any = {};
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
const isStream = (obj: any) =>
	obj &&
	typeof obj === "object" &&
	typeof obj.pipe === "function";
/**
 * Check if obj is object
 * @param obj any
 */
const isObject = (obj: any) =>
	obj &&
	typeof obj === "object" && !Buffer.isBuffer(obj);

/**
 * Check if obj is readable
 * @param obj any
 */
const isReadable = (obj: any) =>
	isStream(obj) &&
	typeof obj._read === "function" &&
	typeof obj._readableState === "object" || obj.readable;

/**
 * Resolve request
 * @param context request context
 */
const resolve = (context: IContext) => {
	if (context.redirect) {
		context.res.writeHead(context.status,
			{ Location: context.redirect },
		);
		return context.res.end();
	}
	context.res.writeHead(context.status, Object.assign({}, app.headers, context.headers));
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
export class HttpException extends Error {
	constructor(message: string, public status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
		this.status = status;
	}
}
