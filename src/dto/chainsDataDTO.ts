import { t } from 'elysia'

const chainData = t.Object({
    name: t.String(),
    active: t.Boolean(),
    tokens: t.Record(t.String(), t.String()),
    tokenIds: t.Record(t.String(), t.String())
})

type ChainData = typeof chainData.static

const chainsData = t.Record(t.Number(), chainData)

type ChainsData = typeof chainsData.static

const bridgeData = t.Object({
    userBalance: t.Number(),
    bridgeCost: t.Number(),
    bridgeTime: t.Number()
})

type BridgeData = typeof bridgeData.static

const chainBridgeData = t.Record(t.Number(), bridgeData)

type ChainBridgeData = typeof chainBridgeData.static

export { chainsData, ChainsData, chainData, ChainData, bridgeData, BridgeData, chainBridgeData, ChainBridgeData }