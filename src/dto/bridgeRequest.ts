import { t } from 'elysia'

const bridgeRequest = t.Object({
    userAddress: t.String(),
	targetChain: t.Number(),
    amount: t.Number(),
	tokenAddress: t.String()
})

type BridgeRequest = typeof bridgeRequest.static

export { bridgeRequest, BridgeRequest }