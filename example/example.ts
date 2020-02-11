import * as fs from "fs";
import { app, Before, bootstrap, Context, Get, IContext, Resource } from "../http";
import { Hello } from "./routes/hello";
import { V2 } from "./routes/v2/v2";
import { World } from "./routes/world";
/*register: [{
		version: "v1",
		routes: [Hello, World]
	}],*/

bootstrap({
	resources: [Hello, World, V2],
	middleware: [(context: IContext) => {
		// console.log("Global Middleware", app.routes);

		return true;
	}],
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
