import { app, Before, Context, Get, IContext, Resource } from "../../http";
import { BaseClass } from "./base";

@Resource("/hello", { version: "v1" })
export class Hello extends BaseClass {
	constructor() {
		super();
	}
	@Get("/")
	public async doSome() {
		this.increment();
		return {
			say: this.doSomething(),
			count: this.counter,
		};
	}

	@Get("/world")
	public async world() {
		console.log(this.counter);
		return {
			hello: 1,
			counter: this.counter,
		};
	}
}
