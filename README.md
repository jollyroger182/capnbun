# capnbun

A simple library that lets you use [Cap'n Web](https://github.com/cloudflare/capnweb) with [Bun](https://bun.com).

## Usage

First install `capnbun`:

```shell
$ bun install capnbun
```

Then in your code:

```typescript
import { bunWebSocketHandler, newBunWebSocketRpcSession } from 'capnbun'
import { RpcTarget } from 'capnweb'

export class API extends RpcTarget {
  greet(name: string) {
    return `Hello, ${name}!`
  }
}

Bun.serve({
  routes: {
    '/api': async (req, server) => {
      return newBunWebSocketRpcSession(req, new API(), server)
    },
  },
  websocket: bunWebSocketHandler(),
})
```

Client-side:

```typescript
import { newWebSocketRpcSession } from 'capnweb'
import type { API } from './api'

using sess = newWebSocketRpcSession<API>('http://localhost:3000/api')

console.log(await sess.greet('capnbun'))
// Hello, capnbun!
```
