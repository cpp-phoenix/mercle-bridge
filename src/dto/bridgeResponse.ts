import { t } from 'elysia'

const bridgeResponse = t.Object({
    totalFee: t.Number(),
    route: t.Object({additionalProperties: true}),
    totalServiceTime: t.Number(),
    status: t.Boolean(),
    message: t.String()
})

type BridgeResponse = typeof bridgeResponse.static

export { bridgeResponse, BridgeResponse }