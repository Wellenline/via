# Via
![Via](https://raw.githubusercontent.com/Wellenline/via/http2/logo.png)
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