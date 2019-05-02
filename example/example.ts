import * as fs from "fs";
import { parse } from "querystring";
import { app, Body, bootstrap, Delete, Get, HttpCode, httpException, HttpHeaders, HttpStatus, INext, IRequest, IResponse, Param, Patch, Post, Put, Query, Req, Res, Resource, Use, HttpException } from "../http";

class Middleware {

	public async one(req: IRequest, res: IResponse, next: any) {

		await new Promise((resolve) => {
			setTimeout(() => {
				resolve();
			}, 2000);
		});

		req.query.middleware_1 = true;
		console.log("in middleware 1");

		next(new HttpException("Test", HttpStatus.BAD_REQUEST));

	}


	public async two(req: any, res: any, next: any) {
		req.query.middleware_2 = true;
		console.log("in middleware 2");

		//setTimeout(() => {
		// next({ secret: 1 });

		res.writeHead(HttpStatus.BAD_REQUEST, app.headers);
		res.write(JSON.stringify({
			message: "Middleware",

			statusCode: HttpStatus.BAD_REQUEST,
		}));
		res.end();
		//}, 5000);
	}
}

const shit = new Middleware();

const middleware_1 = (req: any, res: any, next: any) => {
	req.query.middleware_1 = true;
	console.log("in middleware 1");

	setTimeout(() => {
		next({ secret: 1 });
	}, 5000);
};

const middleware_2 = (req: any, res: any, next: any) => {
	console.log("in middleware 2");
	req.query.middleware_2 = true;

	next({ ...{ middleware_next: 2 }, ...req.next });
};

const body_parser = (req: IRequest, res: IResponse, next: INext) => {
	if (["POST", "PUT", "PATCH"].includes(req.method)) {
		let body = "";
		req.on("data", (data) => {
			body += data;
		});
		req.on("end", () => {
			req.body = parse(body);
			next();
		});
	} else {
		next();
	}
};
@Resource()
export class Example {
	constructor() {
		console.log("example init");
	}
	@Get("/error")
	@HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
	public async error(@Res() res: IResponse, @Query("error") error: boolean) {

		if (error) {
			throw httpException("SomeShit Happened", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return "Append error query param to trigger httpException";
	}

	@Get("/string")
	@HttpHeaders({
		"Content-type": "text/html",
	})
	public async get() {
		return "<h2>Hello</h2> <b>IM a html string</b>";
	}

	@Get("/json/:id?/hello")
	@HttpCode(HttpStatus.OK)
	@Use(shit.one, shit.two)
	public async json(@Req() req: IRequest, @Param() params: any, @Query() query: any) {
		return {
			hello: app,
			next: req.next,
			params,
			query,
		};
	}

	@Get("/stream")
	@HttpCode(200)
	@HttpHeaders({
		"Content-type": "image/png",
	})
	public async stream(@Res() res: IResponse) {
		return fs.readFileSync("./test/logo.png");
	}

	@Post("/post")
	@HttpCode(201)
	public async post(@Res() res: IResponse, @Body() body: any) {
		console.log("posting", body);
		return {
			hel: 1,
		};
	}

	@Put("/json/:id?/hello")
	public async update(@Res() res: IResponse, @Body() body: any) {
		return {
			body,
			upadting: true,
		};
	}

	@Patch("/patch")
	public async patch(@Res() res: IResponse, @Body() body: any) {
		return body;
	}

	@Delete("/json/:id?")
	public async delete(@Res() res: IResponse, @Body() body: any, @Param() param: any) {
		return {
			DELETING: true,
			param,
		};
	}
}

@Resource("/test")
export class Test {

	@Get("/stream")
	@HttpHeaders({
		"Content-type": "image/png",
	})
	public async stream(@Res() res: IResponse) {
		return fs.readFileSync("../test/logo.png");
	}
}

bootstrap({
	middleware: [body_parser],
	port: 3000,
});
