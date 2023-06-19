import { app, Before, Context, Get, IContext, Resource } from "../../http";
import { BaseClass } from "./base";

@Resource("/query")
export class Query {

	@Get("/")
	public async index(@Context() context: IContext) {
		return {
			queryParams: context.query,
		}
	}
}
