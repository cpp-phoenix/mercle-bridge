import { Elysia, t } from 'elysia'
import { bridgeRequest } from '../dto/bridgeRequest'
import { bridgeResponse, BridgeResponse } from '../dto/bridgeResponse'
import { getBridgePaths } from '../services/bridgeService'

export const bridge = new Elysia()
    .get('/bridge', async (ctx) => {
        try {
            let resp: BridgeResponse = await getBridgePaths(ctx.query, ctx.cache)
            return resp
        } catch (err) {
            console.log(err)
            let resp: BridgeResponse = Object.create(bridgeResponse)
            resp.status=false
            return ctx.error(500, resp)
        }
	}, {
		query: bridgeRequest
	})