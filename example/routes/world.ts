import { app, Before, Context, Get, IContext, Resource } from "../../http";

@Resource("/world")
export class World {
	@Get("/")
	public async hello() {
		return "world";
	}
}
