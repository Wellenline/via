import { IncomingMessage, OutgoingHttpHeaders, Server, ServerResponse } from "http";
import "reflect-metadata";
export declare enum HttpStatus {
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
    HTTP_VERSION_NOT_SUPPORTED = 505
}
export declare type IResponse = ServerResponse;
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
    middleware?: any[];
    autoload?: string;
}
export interface IException {
    message?: string;
    error?: any;
    statusCode?: number;
}
export declare type INext = (data?: object) => void;
export declare enum HttpMethodsEnum {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
    PATCH = 4,
    MIXED = 5,
    HEAD = 6,
    OPTIONS = 7
}
export declare enum Constants {
    INVALID_ROUTE = "Invalid route",
    NO_RESPONSE = "No response",
    ROUTE_DATA = "__route_data__",
    ROUTE_MIDDLEWARE = "__route_middleware__",
    ROUTE_PARAMS = "__route_params__",
    ROUTE_HEADERS = "__route_headers",
    ROUTE_CODE = "__route_code__"
}
export declare const app: IApp;
export declare const bootstrap: (options: IOptions) => void;
/**
 * Resource decorator
 * @param path route path
 */
export declare const Resource: (path?: string) => (target: any) => void;
export declare const httpException: (message: string, statusCode: HttpStatus, error?: string | object) => {
    error: string | object;
    message: string;
    statusCode: HttpStatus;
};
/**
 * Route/Resource middleware
 * @param middleware
 */
export declare const Use: (...middleware: any[]) => (target: object, propertyKey: string) => void;
/**
 * Set custom response headers, defaults to application/json
 * @param headers OutgoingHttpHeaders
 */
export declare const HttpHeaders: (headers: OutgoingHttpHeaders) => (target: object, propertyKey: string) => void;
/**
 * Set custom Http Response code, defaults to 200
 * @param code HttpStatus
 */
export declare const HttpCode: (code: HttpStatus) => (target: object, propertyKey: string) => void;
/**
 * @Route Decorator
 * @param method HttpMethodsEnum
 * @param path Route path
 */
export declare const Route: (method: HttpMethodsEnum, path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * @Get Decorator
 * @param path Get path
 */
export declare const Get: (path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * @Get Decorator
 * @param path Get path
 */
export declare const Post: (path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * @Get Decorator
 * @param path Get path
 */
export declare const Put: (path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * @Get Decorator
 * @param path Get path
 */
export declare const Patch: (path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * @Get Decorator
 * @param path Get path
 */
export declare const Delete: (path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * @Get Decorator
 * @param path Get path
 */
export declare const Mixed: (path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * @Get Decorator
 * @param path Get path
 */
export declare const Head: (path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * @Get Decorator
 * @param path Get path
 */
export declare const Options: (path: string) => (target: object, name: string, descriptor: TypedPropertyDescriptor<any>) => void;
/**
 * Get request parameters
 * @param key optional key to lookup
 */
export declare const Param: (key?: string) => (target: object, name: string, index: number) => void;
/**
 * Get request query parameters
 * @param key optional key to lookup
 */
export declare const Query: (key?: string) => (target: object, name: string, index: number) => void;
/**
 * Get POST request body
 * @param key optional key to lookup
 */
export declare const Body: (key?: string) => (target: object, name: string, index: number) => void;
/**
 * Response instance
 */
export declare const Res: () => (target: object, name: string, index: number) => void;
/**
 * Request Instance
 */
export declare const Req: () => (target: object, name: string, index: number) => void;
