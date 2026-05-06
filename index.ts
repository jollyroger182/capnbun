import { newWebSocketRpcSession } from 'capnweb'

export interface WebSocketData {
	capnbun?: { wrapper?: WebSocketWrapper; localMain: any }
}

export class WebSocketWrapper extends EventTarget {
	constructor(public wrapped: Bun.ServerWebSocket<WebSocketData>) {
		super()
	}

	send(data: string | Bun.BufferSource, compressed?: boolean) {
		return this.wrapped.send(data, compressed)
	}

	close(code?: number, reason?: string) {
		this.wrapped.close(code, reason)
	}
}

export function newBunWebSocketRpcSession(
	request: Request,
	localMain: any,
	server: Bun.Server<WebSocketData>,
) {
	if (!server.upgrade(request, { data: { capnbun: { localMain } } })) {
		return Response.json({ error: 'Expected a WebSocket upgrade request' }, { status: 400 })
	}
	return new Response()
}

export function bunWebSocketHandler() {
	return {
		open: (ws) => {
			if (!ws.data.capnbun) return

			const wrapper = new WebSocketWrapper(ws)
			ws.data.capnbun.wrapper = wrapper
			newWebSocketRpcSession(wrapper as any, ws.data.capnbun.localMain)
		},
		message: (ws, data) => {
			if (!ws.data.capnbun) return

			ws.data.capnbun.wrapper?.dispatchEvent(new MessageEvent('message', { data }))
		},
		close: (ws, code, reason) => {
			if (!ws.data.capnbun) return

			ws.data.capnbun.wrapper?.dispatchEvent(new CloseEvent('close', { code, reason }))
		},
	} satisfies Bun.WebSocketHandler<WebSocketData>
}
