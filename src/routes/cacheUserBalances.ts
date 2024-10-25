import { Elysia, t } from 'elysia'
import { cacheUserData} from '../services/cacheService'

export const cacheUser = new Elysia()
    .post('/cache-user-balance', async (ctx) => {
        // ctx.cache.set(ctx.body.userAddress,JSON.parse('{"1":"0","10":"16021087","100":"0","137":"0","324":"0","1101":"600993","8453":"0","43114":"0","59144":"0","81457":"0","534352":"0","1313161554":"0"}'))
        try {
            cacheUserData(ctx.body.userAddress, ctx.cache)
            return "success"
        } catch (err) {
            console.log(err)
            return ctx.error(500, "something went wrong")
        }
	}, {
        body: t.Object({ 
            userAddress: t.String() 
        }) 
    })
    .get('/get-user-balance', (ctx) => {
        // return JSON.stringify(ctx.cache.get(ctx.query.userAddress))
        return JSON.stringify(ctx.cache.get(ctx.query.userAddress))
    }, {
		query: t.Object({
            userAddress: t.String()
        })
	})