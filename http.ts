import { createServer, IncomingMessage, Server, ServerResponse, OutgoingHttpHeaders } from "http";
import "reflect-metadata";
import { parse } from "url";
import * as fs from "fs";

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
export interface IResponse extends ServerResponse { }

export interface IApp {
	server?: Server;
	routes: IRoute[];
	next: boolean,
	middleware: any[];
	headers: OutgoingHttpHeaders;
}
export interface IParam {
	index?: number;
	name?: string;
	fn: Function
}
export interface IRoute {
	method: number;
	path: string;
	name: string;
	middleware: Function[];
	params: IParam[];
	fn: Function;
	responseHttpCode: HttpStatus;
	responseHttpHeaders: OutgoingHttpHeaders;
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
}
export interface IOptions {
	port: number | string;
	middleware?: Function[];
	autoload?: string;
}
export interface INext {
	(data?: object): void;
}
export enum HttpMethodsEnum {
	GET = 0,
	POST,
	PUT,
	DELETE,
	PATCH,
	MIXED,
	HEAD,
	OPTIONS
}
export enum Constants {
	INVALID_ROUTE = "Invalid route",
	NO_RESPONSE = "No response",
	ROUTE_DATA = "__route_data__",
	ROUTE_MIDDLEWARE = "__route_middleware__",
	ROUTE_PARAMS = "__route_params__",
	ROUTE_HEADERS = "__route_headers",
	ROUTE_CODE = "__route_code__",
}
export const app: IApp = {
	routes: [],
	next: false,
	middleware: [],
	headers: {
		"Content-type": "application/json",
	}
}

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
}

/**
 * Resource decorator
 * @param path route path
 */
export const Resource = (path: string = "") => (target: Function) => {
	const resourceMiddleware = Reflect.getMetadata(Constants.ROUTE_MIDDLEWARE, target) || [];
	const routes = Reflect.getMetadata(Constants.ROUTE_DATA, target.prototype) || [];

	app.routes = app.routes.concat(routes.map((route: IRoute | any) => {
		const middleware = Reflect.getMetadata(Constants.ROUTE_MIDDLEWARE + route.name, target.prototype) || [];
		const params = Reflect.getMetadata(Constants.ROUTE_PARAMS + route.name, target.prototype) || [];
		const responseHttpCode = Reflect.getMetadata(Constants.ROUTE_CODE + route.name, target.prototype) || HttpStatus.OK;
		const responseHttpHeaders = Reflect.getMetadata(Constants.ROUTE_HEADERS + route.name, target.prototype) || app.headers;

		return {
			method: route.method,
			middleware: [...resourceMiddleware, ...middleware],
			name: route.name,
			params,
			path: path + route.path,
			fn: route.descriptor.value,
			responseHttpCode,
			responseHttpHeaders
		};
	}));

	Reflect.defineMetadata(Constants.ROUTE_DATA, app.routes, target);
};


export const httpExecption = (message: string, statusCode: HttpStatus, error?: object | string) => {
	return {
		statusCode,
		error,
		message
	}
}

// Decorators
/**
 * Route/Resource middleware
 * @param middleware 
 */
export const Use = (...middleware: Function[]) => (target: object, propertyKey: string) => {
	Reflect.defineMetadata(Constants.ROUTE_MIDDLEWARE + (propertyKey ? propertyKey : ""), middleware, target);
};

/**
 * Set custom response headers, defaults to application/json
 * @param headers OutgoingHttpHeaders
 */
export const HttpHeaders = (headers: OutgoingHttpHeaders) => (target: object, propertyKey: string) => {
	Reflect.defineMetadata(Constants.ROUTE_HEADERS + (propertyKey ? propertyKey : ""), headers, target);
};

/**
 * Set custom Http Response code, defaults to 200
 * @param code HttpStatus
 */
export const HttpCode = (code: HttpStatus) => (target: object, propertyKey: string) => {
	Reflect.defineMetadata(Constants.ROUTE_CODE + (propertyKey ? propertyKey : ""), code, target);
}

/**
 * @Route Decorator
 * @param method HttpMethodsEnum
 * @param path Route path
 */
export const Route = (method: HttpMethodsEnum, path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => {
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
 * Response instance
 */
export const Res = () => decorate((req: IRequest) => req.response);

/**
 * Request Instance
 */
export const Req = () => decorate((req: IRequest) => req.request);


const onRequest = async (req: IRequest, res: IResponse) => {
	req.params = {};
	req.parsed = parse(req.url, true);

	req.response = res;
	req.request = req;

	app.next = true;
	req.route = getRoute(req);
	req.params = decodeValues(req.params);
	req.query = decodeValues(req.parsed.query);
	try {

		if (app.middleware.length > 0) {
			await execute(app.middleware, req, res);
		}

		if (!req.route) {
			throw httpExecption(Constants.INVALID_ROUTE, HttpStatus.NOT_FOUND);
		}

		if (req.route.middleware && app.next) {
			await execute(req.route.middleware, req, res);
		}

		if (!app.next) {
			return;
		}

		const response = await req.route.fn(...args(req));

		if (response) {

			res.writeHead(req.route.responseHttpCode, req.route.responseHttpHeaders);
			Buffer.isBuffer(response) || typeof response !== "object" ? res.write(response) : res.write(JSON.stringify(response));

		} else {
			if (!res.finished) {
				throw httpExecption(Constants.NO_RESPONSE, HttpStatus.BAD_REQUEST);
			}
		}

	} catch (e) {
		res.writeHead(e.statusCode || HttpStatus.INTERNAL_SERVER_ERROR, app.headers);
		res.write(JSON.stringify(e));
	} finally {
		res.end();
	}

}

/**
 * Get decorated arguments
 * @param req Request
 */
const args = (req: IRequest) => {
	const args = [];
	if (req.route.params) {
		req.route.params.sort((a, b) => a.index - b.index);
		for (const param of req.route.params) {
			let result;
			if (param !== undefined) {
				result = param.fn(req);
			}
			args.push(result);
		}
	}
	return args;
}

/**
 * Run middleware
 * @param middleware 
 * @param req 
 * @param res 
 */
const execute = async (list: Function[], req: IRequest, res: IResponse) => {
	return await Promise.all(list.map(async (fn) => {
		app.next = false;
		if (fn instanceof Function) {
			return new Promise((resolve, reject) => {
				fn(req, res, (data?: string | number | object | string[]) => {
					app.next = true;
					req.next = data || {};
					return resolve();
				});
			});
		}
	}));
}


/**
 * Find route and match params
 * @param req Request
 */
const getRoute = (req: IRequest) => {
	return app.routes.find((route) => {
		const match = /^(.*)\?.*#.*|(.*)(?=\?|#)|(.*[^\?#])$/.exec(req.url);

		const base = match[1] || match[2] || match[3];

		const keys = [];
		const regex = /:([^\/\?]+)\??/g;
		route.path = route.path.endsWith("/") ? route.path.slice(0, -1) : route.path;

		let params = regex.exec(route.path);
		while (params != null) {
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
	})
}

/**
 * Decorate 
 * @param fn 
 */
const decorate = (fn: Function) => {
	return (target: object, name: string, index: number) => {
		const meta = Reflect.getMetadata(Constants.ROUTE_PARAMS + name, target) || [];
		meta.push({ index, name, fn });
		Reflect.defineMetadata(Constants.ROUTE_PARAMS + name, meta, target);
	};
}

/**
 * Decode values
 * @param object parameter values
 */
const decodeValues = (object: any) => {
	const decoded: any = {};
	for (let key in object) {
		decoded[key] = !isNaN(parseFloat(object[key])) && isFinite(object[key]) ? (Number.isInteger(object[key]) ? Number.parseInt(object[key], 10) : Number.parseFloat(object[key])) : object[key]
	}
	return decoded;
}

