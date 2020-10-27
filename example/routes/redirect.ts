import { app, Before, Context, Get, IContext, Resource } from "../../http";
import { BaseClass } from "./base";

@Resource("/redirect", { version: "v1" })
export class Redirect {

	@Get("/")
	public async world(@Context() context: IContext) {
		context.redirect = "https://google.com";
	}
}
