import { t } from 'elysia'

const routeData = t.Object({
    chain: t.String(),
    chainId: t.Number(),
    amount: t.Number(),
    serviceTime: t.Number(),
    fee: t.Number()
})

type RouteData = typeof routeData.static

const bridgeResponse = t.Object({
    totalFee: t.Number(),
    route: t.Array(routeData),
    totalServiceTime: t.Number(),
    status: t.Boolean(),
    message: t.String()
})

type BridgeResponse = typeof bridgeResponse.static

export { bridgeResponse, BridgeResponse, routeData, RouteData }