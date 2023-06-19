import test from "ava";
import * as supertest from "supertest";
import { app, Before, bootstrap, Context, Get, HttpMethodsEnum, HttpStatus, IContext, IRoute, Post, Resource } from "../http";

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

test("Via:json", async (t) => {
	@Resource("/json")
	class Test {

		@Get("/")
		public json(@Context() context: IContext) {
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

test("Via:query", async (t) => {
	@Resource()
	class Test {

		@Get("/querytest")
		public querytest(@Context() context: IContext) {
			return {
				code: 200,
				message: {
					hello: context.query.hello,
					query: context.query,
					world: context.query.world,
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

test("Via:param", async (t) => {
	@Resource()
	class Test {

		@Get("/paramtest/:hello")
		public paramTest(@Context("params") param: { hello: string }) {
			return {
				message: {
					hello: param.hello,
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

test("Via:optionalParams", async (t) => {
	@Resource()
	class Test {

		@Get("/paramtest/:first/:second?/:third/:fourth?")
		public paramTest(@Context() context: IContext) {
			return {
				message: {
					first: context.params.first,
					second: context.params.second,
					third: context.params.third,
					fourth: context.params.fourth,
				},
			};
		}
	}

	if (!app.server) {
		bootstrap({ port: 3000 });
	}

	const response = await supertest(app.server).get("/paramtest/1/2/3/633751515605880026891631").expect(200).expect("Content-Type", /json/);
	t.is(response.status, 200);
	t.is(response.body.message.first, 1);
	t.is(response.body.message.second, 2);
	t.is(response.body.message.third, 3);
	t.is(response.body.message.fourth, "633751515605880026891631");


	const response2 = await supertest(app.server).get("/paramtest/1/2").expect(200).expect("Content-Type", /json/);
	t.is(response2.status, 200);
	t.is(response2.body.message.first, 1);
	t.is(response2.body.message.second, undefined);
	t.is(response2.body.message.third, 2);

});

test("Via:html-with-middleware/param", async (t) => {
	const getNumber = async (context: IContext) => {
		context.req.params.number = parseInt(context.req.params.number, 10);
		context.test = true;
		return true;
	};

	@Resource("/test")
	class Test {
		@Get("/html/:number")
		@Before(getNumber)
		public async html(@Context() context: IContext) {
			t.is(context.req.params.number, 10);
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

	const response = await supertest(app.server).get("/test/html/10").expect(418).expect("content-type", /html/);
	t.is(response.text, "<h1>Hello<h1>");

});
