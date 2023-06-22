import { app, Before, Context, Get, HttpException, HttpStatus, IContext, Resource } from "../../http";
import { BaseClass } from "./base";
declare const o: any;
@Resource("/errors")
export class Errors {

	@Get("/")
	public async error(@Context() context: IContext) {
		throw new HttpException("Teapot", HttpStatus.I_AM_A_TEAPOT);
	}

	@Get("/headers")
	public async headers(@Context() context: IContext) {
		throw new HttpException("Custom error", HttpStatus.INTERNAL_SERVER_ERROR, {
			"X-Custom-Header": "Custom Value",
		});
	}

	@Get("/header")
	public async header(@Context() context: IContext) {
		throw new HttpException("Custom error updated", HttpStatus.INTERNAL_SERVER_ERROR, {
			"X-Custom-Header": "Custom Value Updated",
		});
	}

	@Get("/unhandled")
	public async unhandled(@Context() context: IContext) {
		o.p = 1;
		return "unhandled";
	}
}
