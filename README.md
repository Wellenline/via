# Via
![Via](https://raw.githubusercontent.com/Wellenline/via/http2/logo.png)

Simple, lightwieght & dependency free HTTP routing framework

[![Build Status](https://travis-ci.org/Wellenline/via.svg?branch=master)](https://travis-ci.org/Wellenline/via)

### Installation
```sh
$ npm add @wellenline/via
```

### Basic Example
```typescript
import { bootstrap, Resource, Get, app } from "@wellenline/via";

@Resource()
export class Hello {
	@Get("/hello")
	public async index() {
		return {
			hello: "world"
		};
	}
}

bootstrap({
	port: 3000,
});
```

## Examples
### Hooks (middleware)
```typescript
@Before((context: IContext) => void)
```

```typescript
import { bootstrap, Resource, Get, app, IContext } from "@wellenline/via";

@Resource("/path", { version: "v1" })
export class Hello {
	@Get("/hello/:hello")
	@Before(async (context: IContext) => {
		return context.params.hello === "world"; // continue if hello === world
	);
	public async index() {
		return {
			hello: "world"
		};
	}
}

bootstrap({
	port: 3000,
});
```