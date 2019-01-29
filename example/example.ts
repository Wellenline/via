import { bootstrap, Resource, Get, HttpCode, HttpStatus, Res, IResponse, Query, httpExecption, HttpHeaders, Use, Req, IRequest, Param, app, Body, Post, Put, Patch, Delete, INext } from "../http"
import * as fs from 'fs';
import { parse } from "querystring";

const middleware_1 = (req: any, res: any, next: any) => {
	req.query.middleware_1 = true;

	setTimeout(() => {
		next({ secret: 1 });
	}, 5000)
}

const middleware_2 = (req: any, res: any, next: any) => {
	req.query.middleware_2 = true;

	next({ ...{ middleware_next: 2 }, ...req.next });
}

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
}
@Resource()
export class Example {
	constructor() {
		console.log("example init");
	}
	@Get("/error")
	@HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
	async error(@Res() res: IResponse, @Query("error") error: boolean) {

		if (error) {
			throw httpExecption("SomeShit Happened", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return "Append error query param to trigger httpException";
	}

	@Get("/string")
	@HttpHeaders({
		"Content-type": "text/html"
	})
	async get() {
		return "<h2>Hello</h2> <b>IM a html string</b>"
	}

	@Get("/json/:id?/hello")
	@HttpCode(HttpStatus.OK)
	@Use(middleware_1, middleware_2)
	async json(@Req() req: IRequest, @Param() params: any, @Query() query: any) {
		return {
			query,
			params,
			next: req.next,
			hello: app
		}
	}

	@Get("/stream")
	@HttpCode(200)
	@HttpHeaders({
		"Content-type": "image/png"
	})
	async stream(@Res() res: IResponse) {
		return fs.readFileSync("./test/logo.png")
	}


	@Post("/post")
	@HttpCode(201)
	async post(@Res() res: IResponse, @Body() body: any) {
		console.log("posting", body);
		return {
			hel: 1
		}
	}

	@Put("/json/:id?/hello")
	async update(@Res() res: IResponse, @Body() body: any) {
		return {
			body,
			"upadting": true
		}
	}

	@Patch("/patch")
	async patch(@Res() res: IResponse, @Body() body: any) {
		return body
	}

	@Delete("/json/:id?")
	async delete(@Res() res: IResponse, @Body() body: any, @Param() param: any) {
		return {
			"DELETING": true,
			param
		}
	}
}

@Resource("/test")
export class Test {

	@Get("/stream")
	@HttpHeaders({
		"Content-type": "image/png"
	})
	async stream(@Res() res: IResponse) {
		return fs.readFileSync("./test/logo.png")
	}
}


bootstrap({
	port: 3000,
	middleware: [body_parser],
});