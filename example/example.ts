import * as fs from "fs";
import { app, bootstrap, Delete, Get, HttpException, HttpStatus, IContext, Patch, Post, Put, Resource, Before, IRequest, Context } from "../http";

let count = 0;
const middleware_2 = async (context: IContext) => {
	console.log("Here")


	const time = Date.now();
	context.middleware_2 = {
		passing: {
			data: "to resource fomr middleware",
		},
		r: `initiate req ${++count}`,
	};
	context.res.setHeader("Response-Time", `${Date.now() - time}ms`);
	return true;
	// throw new HttpException("error", HttpStatus.BAD_GATEWAY);

	// next({ ...{ middleware_next: 2 }, ...req.next });
};

@Resource()
@Before(async (ctx: any) => {
	console.log("Resource middleware");
	return true;
})
export class Example {
	@Get("/")
	public async hello() {
		return "world";
	}

	@Get("/json/:id?/hello")
	@Before(middleware_2)
	public async json(@Context() ctx: IContext, @Context("params") params: any) {
		/*ctx.headers = {
			"Content-type": "text/html",
		};*/
		return {
			context: ctx.middleware_2,
		 	hello: app,
			next: ctx.next,
			paramss: ctx.params,
			params,
			query: ctx.query,
			headers: ctx.headers,
		};
	}

	@Get("/stream")
	public async stream(ctx: any) {
		ctx.headers = {
			"Content-type": "image/png",
		};
		const image = fs.readFileSync("../test/logo.png");
		return image;
		// ctx.res.end(image, "binary");
	}
}

bootstrap({
	// middleware: [body_parser],
	port: 3000,
	// tslint:disable-next-line:object-literal-sort-keys
	/*http2: {
		cert: fs.readFileSync(__dirname + "/keys/server.crt"),
		key: fs.readFileSync(__dirname + "/keys/server.key"),
		// tslint:disable-next-line:object-literal-sort-keys
		allowHTTP1: true,
	},
*/
});
