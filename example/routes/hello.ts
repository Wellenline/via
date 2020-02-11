import { app, Before, Context, Get, IContext, Resource } from "../../http";

@Resource("/hello", { version: "v1" })
export class Hello {
	@Get("/")
	public async hello() {
		return "world";
	}

	@Get("/world")
	public async world() {
		return "hello";
	}
}
