import { newWebSocketRpcSession } from 'capnweb'
import type { API } from './basic'

using sess = newWebSocketRpcSession<API>('http://localhost:3000/api')

console.log(await sess.greet('capnbun'))
