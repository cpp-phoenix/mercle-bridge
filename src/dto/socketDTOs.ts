import { t } from 'elysia'

const tokenBalanceResponse = t.Object({
    success: t.Boolean(),
    result: t.Object({
        chainId: t.Number(),
        tokenAddress: t.String(),
        userAddress: t.String(),
        balance: t.Number(),
        icon: t.String(),
        logoURI: t.String(),
        decimals: t.Number(),
        symbol: t.String(),
        name: t.String(),
    }),
    statusCode: t.Number()
})

type TokenBalanceResponse = typeof tokenBalanceResponse.static

const quoteResponse = t.Object({
    success: t.Boolean(),
    result: t.Object({
        routes: t.Array(t.Object({
            totalGasFeesInUsd: t.Number(),
            serviceTime: t.Number()
        }))
    }),
    statusCode: t.Number()
})

type QuoteResponse = typeof quoteResponse.static

export { tokenBalanceResponse, TokenBalanceResponse, quoteResponse, QuoteResponse }