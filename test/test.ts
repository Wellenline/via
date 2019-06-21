/*import test from "ava";
import * as supertest from "supertest";
import { app, Body, bootstrap, Context, Get, HttpMethodsEnum, HttpStatus, IContext, INext, IRequest, IResponse, IRoute, Param, Post, Query, Resource, Use } from "../http";

test("get request", (t) => {
	@Resource()
	class Test {
		@Get("/test")
		public getTest() {
			// test
			return {
				code: 200,
				message: 1,
			};
		}
	}

	t.is(app.routes.length, 1);
	const route: IRoute = app.routes[0];
	t.is(route.name, "getTest");
	t.is(typeof route.fn, "function");
	t.is(route.method, HttpMethodsEnum.GET);
	t.is(route.path, "/test");

	app.routes = [];

});

test("multiple", (t) => {
	@Resource()
	class Test {
		@Get("/test")
		public getTest() {
			// test
		}

		@Post("/test")
		public postTest() {
			// test
		}
	}
	t.is(app.routes.length, 2);
	t.is(app.routes[1].method, HttpMethodsEnum.POST);
	app.routes = [];
});

test("laf:json", async (t) => {
	@Resource("/json")
	class Test {

		@Get("/")
		public json(@Context("req") req: IRequest, @Param("number") numb: number) {
			return {
				code: 200,
				message: {
					data: true,
				},
			};
		}
	}
	bootstrap({
		port: 3000,
	});
	const response: any = await supertest(app.server).get("/json").expect(200).expect("Content-Type", /json/);

	t.is(response.body.message.data, true);

});

test("laf:query", async (t) => {
	@Resource()
	class Test {

		@Get("/querytest")
		public querytest(@Query("hello") hello: string, @Query("world") world: string, @Query() query: object) {
			return {
				code: 200,
				message: {
					hello,
					query,
					world,
				},
			};
		}
	}

	if (!app.server) {
		bootstrap({
			port: 3000,
		});
	}

	const response: any = await supertest(app.server).get("/querytest?hello=world&world=hello").expect(200).expect("Content-Type", /json/);

	t.is(response.body.message.hello, "world");
	t.is(response.body.message.world, "hello");
	t.is(response.body.message.query.hello, "world");
	t.is(response.body.message.query.world, "hello");

});

test("laf:param", async (t) => {
	@Resource()
	class Test {

		@Get("/paramtest/:hello")
		public paramTest(@Param("hello") hello: string, @Param() param: { hello: string }) {
			return {
				message: {
					hello,
					param,
				},
			};
		}
	}

	if (!app.server) {
		bootstrap({ port: 3000 });
	}

	const response = await supertest(app.server).get("/paramtest/world").expect(200).expect("Content-Type", /json/);

	t.is(response.status, 200);
	t.is(response.body.message.hello, "world");
	t.is(response.body.message.param.hello, "world");

});

test("laf:body", async (t) => {
	@Resource()
	class BodyTest {

		@Post("/bodytest")
		@Use(async (context: IContext) => {
			return new Promise((resolve, reject) => {
				let body = "";
				context.req.on("data", (chunk) => {
					body += chunk.toString();
				});
				context.req.on("end", () => {
					context.req.body = JSON.parse(body);
					resolve();
				});
			});

		})
		public bodyTest(@Body("hello") hello: string, @Body() body: { hello: string }) {
			return {
				code: 200,
				message: {
					body,
					hello,
				},
			};
		}
	}

	if (!app.server) {
		bootstrap({ port: 3000 });
	}

	const response = await supertest(app.server).post("/bodytest").send({ hello: "world" }).expect(200);
	t.is(response.body.message.hello, "world");
	t.is(response.body.message.body.hello, "world");
	t.is(Object.keys(response.body.message.body).length, 1);

});

test("laf:html-with-middleware/param", async (t) => {
	const getNumber = async (context: IContext) => {
		context.req.params.number = parseInt(context.req.params.number, 10);
		context.test = true;
		return true;
	};

	@Resource("/test")
	class Test {

		@Get("/html/:number")
		@Use(getNumber)
		public async html(@Context() context: IContext, @Param("number") n: number) {
			t.is(context.req.params.number, n);
			t.is(context.test, true);

			context.headers = {
				"Content-type": "text/html",
			};

			context.status = HttpStatus.I_AM_A_TEAPOT;

			return "<h1>Hello<h1>";
		}

	}

	if (!app.server) {
		bootstrap({ port: 3000 });
	}

	try {
		const response = await supertest(app.server).get("/test/html/10").expect(418).expect("content-type", /html/);

		t.is(response.text, "<h1>Hello<h1>");
	} catch (e) {
		console.error(e);
	}
});
*/
