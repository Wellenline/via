import * as fs from "fs";
import { app, Body, bootstrap, Context, Delete, Get, HttpException, HttpStatus, IContext, Param, Patch, Post, Put, Query, Resource, Use } from "../http";

let count = 0;
const middleware_2 = async (context: IContext) => {
	context.middleware_2 = {
		passing: {
			data: "to resource fomr middleware",
		},
	};

	await new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, 3000);
	});

	const time = Date.now();
	console.log(`initiate req ${++count}`);
	context.res.setHeader("Response-Time", `${Date.now() - time}ms`);
	return true;
	// throw new HttpException("error", HttpStatus.BAD_GATEWAY);

	// next({ ...{ middleware_next: 2 }, ...req.next });
};
@Resource()
export class Example {
	constructor() {
		console.log("example init");
	}
	@Get("/error")
	@Use(middleware_2)
	public async error(@Query("error") error: boolean) {

		if (error) {
			throw new HttpException("Error Happened", HttpStatus.I_AM_A_TEAPOT);
		}

		return "Append error query param to trigger httpException";
	}

	@Get("/string")
	public async get(@Context() context: IContext) {
		/*req.route.headers = {
			"Content-type": "text/html",
		};
		req.route.httpStatus = 200;*/
		context.status = 200;
		context.headers = {
			"Content-type": "text/html",
		};

		return "<h2>Hello</h2> <b>IM a html string</b>";
		// return "<h2>Hello</h2> <b>IM a html string</b>";
	}

	@Get("/json/:id?/hello")
	@Use(middleware_2)
	public async json(@Context() context: IContext, @Param() params: any, @Query() query: any) {

		return {
			cotext: context.middleware_2,
			hello: app,
			next: context.req.next,
			params,
			query,
		};
	}

	@Get("/stream")
	public async stream() {
		return fs.readFileSync("./test/logo.png");
	}

	@Post("/post")
	public async post(@Body() body: any) {
		console.log("posting", body);
		return {
			hel: 1,
		};
	}

	@Put("/json/:id?/hello")
	public async update(@Body() body: any) {
		return {
			body,
			upadting: true,
		};
	}

	@Patch("/patch")
	public async patch(@Body() body: any) {
		return body;
	}

	@Delete("/json/:id?")
	public async delete(@Param() param: any) {
		return {
			DELETING: true,
			param,
		};
	}
}

@Resource("/test")
export class Test {
	@Get("/stream")
	public async stream(@Context() context: IContext) {
		context.headers = {
			"Content-type": "image/png",
		};
		return fs.readFileSync("../test/logo.png");
	}
}

bootstrap({
	// middleware: [body_parser],
	port: 3000,
	// tslint:disable-next-line:object-literal-sort-keys
	http2: {
		cert: fs.readFileSync(__dirname + "/keys/server.crt"),
		key: fs.readFileSync(__dirname + "/keys/server.key"),
		// tslint:disable-next-line:object-literal-sort-keys
		allowHTTP1: true,
	},

});
