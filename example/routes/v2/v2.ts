import { Get, Resource } from "../../../http";

@Resource("/", { version: "v2" })
export class V2 {
	@Get("/")
	public async index() {
		return "api version 2";
	}
}
