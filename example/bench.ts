import { bootstrap, Get, Resource } from "../http";

@Resource()
export class Benchmark {
	@Get("/")
	public index() {
		return {
			hello: "world",
		};
	}
}
bootstrap({
	port: 4000,
});
