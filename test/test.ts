import test from "ava";
import * as supertest from "supertest";
import { app, Resource, Get, HttpMethodsEnum, IRequest, IResponse, IRoute, Param, Post, Req, Use, Query, Body, INext, bootstrap, HttpHeaders } from "../http";

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
		public json(@Req() req: IRequest, @Param("number") numb: number) {
			return {
				code: 200,
				message: {
					data: true,
				},
			};
		}
	}
	t.plan(2);
	bootstrap({
		port: 3000
	});
	const res: any = await supertest(app.server).get("/json").expect(200).expect("Content-Type", /json/);

	t.is(res.status, 200);
	t.is(res.body.message.data, true);

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
					world,
					query,
				},
			};
		}
	}
	t.plan(5);

	if (!app.server) {
		bootstrap({
			port: 3000
		});
	}

	const res: any = await supertest(app.server).get("/querytest?hello=world&world=hello").expect(200).expect("Content-Type", /json/);

	t.is(res.status, 200);
	t.is(res.body.message.hello, "world");
	t.is(res.body.message.world, "hello");
	t.is(res.body.message.query.hello, "world");
	t.is(res.body.message.query.world, "hello");

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
	t.plan(3);

	if (!app.server) {
		bootstrap({ port: 3000 });
	}

	const res = await supertest(app.server).get("/paramtest/world").expect(200).expect("Content-Type", /json/);

	t.is(res.status, 200);
	t.is(res.body.message.hello, "world");
	t.is(res.body.message.param.hello, "world");

});


test("laf:body", async (t) => {
	@Resource()
	class BodyTest {

		@Post("/bodytest")
		@Use((req: IRequest, res: IResponse, next: INext) => {
			let body = "";
			req.on("data", (chunk) => {
				body += chunk.toString();
			});
			req.on("end", () => {
				req.body = JSON.parse(body);
				next();
			});

		})
		public bodyTest(@Body("hello") hello: string, @Body() body: { hello: string }) {
			return {
				code: 200,
				message: {
					hello,
					body,
				},
			};
		}
	}
	t.plan(4);

	if (!app.server) {
		bootstrap({ port: 3000 });
	}

	const res = await supertest(app.server).post("/bodytest").send({ hello: "world" }).expect(200);
	t.is(res.status, 200);
	t.is(res.body.message.hello, "world");
	t.is(res.body.message.body.hello, "world");
	t.is(Object.keys(res.body.message.body).length, 1);

});


test("laf:html-with-middleware/param", async (t) => {
	const getNumber = (req: IRequest, res: IResponse, next: INext) => {
		req.params.number = parseInt(req.params.number, 0);
		t.is(req.params.number, 10);
		next({
			hello: 5,
		});

	};

	@Resource("/test")
	class Test {

		@Get("/html/:number")
		@HttpHeaders({
			"Content-Type": "text/html",
		})
		@Use(getNumber)
		public html(@Req() req: IRequest, @Param("number") numb: number) {
			t.is(req.params.number, 10);
			t.is(req.next.hello, 5);

			t.is(req.next.hello, numb - req.next.hello);

			return "<h1>Hello<h1>";
		}

	}

	t.plan(6);

	if (!app.server) {
		bootstrap({ port: 3000 });
	}

	const res = await supertest(app.server).get("/test/html/10").expect(200).expect("Content-Type", /html/);

	t.is(res.status, 200);
	t.is(res.text, "<h1>Hello<h1>");
});
