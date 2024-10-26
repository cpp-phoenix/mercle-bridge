import { Elysia, t } from 'elysia'
import { cacheUserData} from '../services/cacheService'

export const cacheUser = new Elysia()
    .post('/cache-user-balance', async (ctx) => {
        try {
            cacheUserData(ctx.body.userAddress, ctx.cache, ctx.body.tokenId)
            return "success"
        } catch (err) {
            console.log(err)
            return ctx.error(500, "something went wrong")
        }
	}, {
        body: t.Object({ 
            userAddress: t.String(),
            tokenId: t.String()
        }) 
    })
    .get('/get-user-balance', (ctx) => {
        console.log(ctx.cache.get(ctx.query.userAddress))
        return ctx.cache.get(ctx.query.userAddress)
    }, {
		query: t.Object({
            userAddress: t.String()
        })
	})