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
