import { app, Before, Context, Get, IContext, Resource } from "../../http";

@Resource("/world")
export class World {
	@Get("/")
	public async hello() {
		return "world";
	}

	@Get("/wild/*")
	public async wild(@Context() context: IContext) {
		return "Im wild";
	}

	@Get("/:param1/:optional?/:notoptional")
	public async parameters(@Context() context: IContext) {
		return {
			param1: context.params.param1,
			optional: context.params.optional,
			notoptiona: context.params.notoptional,
		};
	}


}

//([\/][^/]+)?