import * as fs from "fs";
import { createServer, IncomingMessage, OutgoingHttpHeaders, Server, ServerResponse } from "http";

import * as http2 from "http2";
import "reflect-metadata";
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
	headers: OutgoingHttpHeaders;
}
export interface IParam {
	index?: number;
	name?: string;
	fn: (req?: IRequest) => void;
}
export interface IRoute {
	method: number;
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
	context: any;
}
export interface IOptions {
	port: number | string;
	middleware?: any[];
	autoload?: string;
	http2?: http2.SecureServerOptions;
}

export interface IContext {
	req: IRequest;
	res: IResponse;
	headers?: OutgoingHttpHeaders;
	status?: HttpStatus;
	[key: string]: any;
}

export interface IException {
	message?: string;
	error?: any;
	statusCode?: number;
}

export type INext = (data?: object) => void;

export enum HttpMethodsEnum {
	GET = 0,
	POST,
	PUT,
	DELETE,
	PATCH,
	MIXED,
	HEAD,
	OPTIONS,
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
};

export const bootstrap = (options: IOptions) => {
	if (options.middleware) {
		app.middleware = options.middleware;
	}

	if (options.autoload) {
		fs.readdirSync(options.autoload).map((file) => {
			if (file.endsWith(".js")) {
				require(options.autoload + "/" + file.replace(/\.[^.$]+$/, ""));
			}
		});
	}

	app.server = createServer(onRequest).listen(options.port);
	// http2.createSecureServer(options.http2, onRequest).listen(options.port);
};

/**
 * Resource decorator
 * @param path route path
 */
export const Resource = (path: string = "") => (target: any) => {
	const resourceMiddleware = Reflect.getMetadata(Constants.ROUTE_MIDDLEWARE, target) || [];
	const routes = Reflect.getMetadata(Constants.ROUTE_DATA, target.prototype) || [];

	app.routes = app.routes.concat(routes.map((route: IRoute | any) => {
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

	Reflect.defineMetadata(Constants.ROUTE_DATA, app.routes, target);
};

// Decorators
/**
 * Route/Resource middleware
 * @param middleware
 */
export const Use = (...middleware: any[]) => (target: object, propertyKey: string) => {
	Reflect.defineMetadata(Constants.ROUTE_MIDDLEWARE + (propertyKey ? propertyKey : ""), middleware, target);
};

/**
 * @Route Decorator
 * @param method HttpMethodsEnum
 * @param path Route path
 */
export const Route = (method: HttpMethodsEnum, path: string) =>
	(target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => {
		const meta = Reflect.getMetadata(Constants.ROUTE_DATA, target) || [];
		meta.push({ method, path, name, descriptor });
		Reflect.defineMetadata(Constants.ROUTE_DATA, meta, target);
	};

/**
 * @Get Decorator
 * @param path Get path
 */
export const Get = (path: string) => Route(HttpMethodsEnum.GET, path);

/**
 * @Get Decorator
 * @param path Get path
 */
export const Post = (path: string) => Route(HttpMethodsEnum.POST, path);

/**
 * @Get Decorator
 * @param path Get path
 */
export const Put = (path: string) => Route(HttpMethodsEnum.PUT, path);

/**
 * @Get Decorator
 * @param path Get path
 */
export const Patch = (path: string) => Route(HttpMethodsEnum.PATCH, path);

/**
 * @Get Decorator
 * @param path Get path
 */
export const Delete = (path: string) => Route(HttpMethodsEnum.DELETE, path);

/**
 * @Get Decorator
 * @param path Get path
 */
export const Mixed = (path: string) => Route(HttpMethodsEnum.MIXED, path);

/**
 * @Get Decorator
 * @param path Get path
 */
export const Head = (path: string) => Route(HttpMethodsEnum.HEAD, path);

/**
 * @Get Decorator
 * @param path Get path
 */
export const Options = (path: string) => Route(HttpMethodsEnum.OPTIONS, path);

/**
 * Get request parameters
 * @param key optional key to lookup
 */
export const Param = (key?: string) => decorate((req: IRequest) => !key ? req.params : req.params[key]);

/**
 * Get request query parameters
 * @param key optional key to lookup
 */
export const Query = (key?: string) => decorate((req: IRequest) => !key ? req.query : req.query[key]);

/**
 * Get POST request body
 * @param key optional key to lookup
 */
export const Body = (key?: string) => decorate((req: IRequest) => !key ? req.body : req.body[key]);

/**
 * Route context
 * @param key optional key to lookup
 */
export const Context = (key?: string) => decorate((req: IRequest) => !key ? req.context : req.context[key]);

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
			headers: app.headers,
			req,
			res,
			status: HttpStatus.OK,
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
 * Get decorated arguments
 * @param req Request
 */
const args = (req: IRequest) => {
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

			req.params = Object.assign(req.params, keys.reduce((val: any, key, index) => {
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
const decorate = (fn: any) => {
	return (target: object, name: string, index: number) => {
		const meta = Reflect.getMetadata(Constants.ROUTE_PARAMS + name, target) || [];
		meta.push({ index, name, fn });
		Reflect.defineMetadata(Constants.ROUTE_PARAMS + name, meta, target);
	};
};

/**
 * Decode values
 * @param object parameter values
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
	typeof obj === "object";

/**
 * Check if obj is readable
 * @param obj any
 */
const isReadable = (obj: any) =>
	isStream(obj) &&
	typeof obj._read === "function" &&
	typeof obj._readableState === "object";

/**
 * Resolve request
 * @param context request context
 */
const resolve = (context: IContext) => {
	context.res.writeHead(context.status, Object.assign(app.headers, context.headers));

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
