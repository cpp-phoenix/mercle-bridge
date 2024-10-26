import { Elysia, t } from 'elysia'
import { cacheRoute } from '../services/cacheService'

export const cacheRoutes = new Elysia()
    .post('/cache-routes', async (ctx) => {
        // ctx.cache.set("routes",JSON.parse('{"1":{"10":{"bridgeCost":1208.5774130300617,"bridgeTime":1740},"100":{"bridgeCost":2208373.853529015,"bridgeTime":120},"137":{"bridgeCost":1784.917654686507,"bridgeTime":900},"324":{"bridgeCost":13747.239599999997,"bridgeTime":120},"8453":{"bridgeCost":2491.6407103111196,"bridgeTime":1440},"59144":{"bridgeCost":149131.29240198337,"bridgeTime":60}},"10":{"1":{"bridgeCost":2252488.8490513335,"bridgeTime":1140},"100":{"bridgeCost":3415.2742109581677,"bridgeTime":120},"137":{"bridgeCost":2505.2134720267827,"bridgeTime":480},"324":{"bridgeCost":13747.239599999997,"bridgeTime":120},"8453":{"bridgeCost":3211.9365276513954,"bridgeTime":1260},"43114":{"bridgeCost":720.295817340276,"bridgeTime":60},"59144":{"bridgeCost":149851.58821932366,"bridgeTime":60},"534352":{"bridgeCost":720.295817340276,"bridgeTime":120},"1313161554":{"bridgeCost":74432.56799999998,"bridgeTime":60}},"56":{"1":{"bridgeCost":5766724.343648032,"bridgeTime":240},"10":{"bridgeCost":3253.749197540662,"bridgeTime":60},"137":{"bridgeCost":3884.276761493953,"bridgeTime":1140}},"100":{"1":{"bridgeCost":4270758.741236338,"bridgeTime":1560},"10":{"bridgeCost":4038.0205084010104,"bridgeTime":60},"137":{"bridgeCost":10376.999629002165,"bridgeTime":180},"8453":{"bridgeCost":10164.496414874551,"bridgeTime":60}},"137":{"1":{"bridgeCost":2109067.051573693,"bridgeTime":1020},"10":{"bridgeCost":1208.550851287144,"bridgeTime":1500},"100":{"bridgeCost":8278.018571726938,"bridgeTime":120},"324":{"bridgeCost":19214.460872019663,"bridgeTime":120},"59144":{"bridgeCost":153417.8251501227,"bridgeTime":60},"1313161554":{"bridgeCost":79899.78927201965,"bridgeTime":60}},"324":{"1":{"bridgeCost":1782418.861878743,"bridgeTime":60},"10":{"bridgeCost":423.21707765932,"bridgeTime":360},"137":{"bridgeCost":1294.7589202987906,"bridgeTime":60},"8453":{"bridgeCost":2155.35322881312,"bridgeTime":60},"43114":{"bridgeCost":348196.23850000004,"bridgeTime":120},"59144":{"bridgeCost":147950.60387810302,"bridgeTime":60},"534352":{"bridgeCost":12188.8194040464,"bridgeTime":60}},"1101":{},"5000":{"1":{"bridgeCost":5401269.278420433,"bridgeTime":180},"10":{"bridgeCost":3253.6776876408644,"bridgeTime":60},"137":{"bridgeCost":3884.276760896372,"bridgeTime":1140}},"8453":{"1":{"bridgeCost":2109067.051573693,"bridgeTime":1020},"10":{"bridgeCost":1208.550851287144,"bridgeTime":1680},"100":{"bridgeCost":5099.493556671282,"bridgeTime":120},"137":{"bridgeCost":1784.917654411904,"bridgeTime":600},"324":{"bridgeCost":22885.577661686002,"bridgeTime":60},"59144":{"bridgeCost":151590.046099789,"bridgeTime":60}},"42161":{},"43114":{"1":{"bridgeCost":2108470.0131057412,"bridgeTime":900},"10":{"bridgeCost":1207.134487577019,"bridgeTime":1500},"137":{"bridgeCost":1783.2165523429262,"bridgeTime":480},"324":{"bridgeCost":204402.32129999998,"bridgeTime":120}},"59144":{"1":{"bridgeCost":1781914.2915637547,"bridgeTime":60},"10":{"bridgeCost":1143.852887649519,"bridgeTime":60},"137":{"bridgeCost":1293.5249602487547,"bridgeTime":60},"324":{"bridgeCost":19223.25342,"bridgeTime":60},"8453":{"bridgeCost":2087.76129816744,"bridgeTime":60},"534352":{"bridgeCost":12164.730568479601,"bridgeTime":60}},"81457":{"1":{"bridgeCost":5274851.998762818,"bridgeTime":420},"10":{"bridgeCost":696.0975992025001,"bridgeTime":1260},"137":{"bridgeCost":11677.296578645635,"bridgeTime":300},"43114":{"bridgeCost":779361.0390000001,"bridgeTime":60},"1313161554":{"bridgeCost":74344.074,"bridgeTime":60}},"534352":{"1":{"bridgeCost":1781914.2915637547,"bridgeTime":60},"10":{"bridgeCost":1143.852887649519,"bridgeTime":60},"137":{"bridgeCost":1293.5249602487547,"bridgeTime":60},"324":{"bridgeCost":19223.25342,"bridgeTime":60},"59144":{"bridgeCost":147774.7031791027,"bridgeTime":60}},"1313161554":{"1":{"bridgeCost":5274851.998762818,"bridgeTime":420},"10":{"bridgeCost":696.0975992025001,"bridgeTime":1320},"137":{"bridgeCost":11677.296578645635,"bridgeTime":300},"43114":{"bridgeCost":779361.0390000001,"bridgeTime":60}}}'))
        try {
            cacheRoute(ctx.cache)
            return "success"
        } catch (err) {
            console.log(err)
            return ctx.error(500, "something went wrong")
        }
	})
    .get('/get-routes', (ctx) => {
        // return JSON.stringify(ctx.cache.get("routes"))
        return ctx.cache.get("routes")
    })