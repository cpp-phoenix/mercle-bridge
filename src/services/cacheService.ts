
import { GET_BALANCE, GET_QUOTE, SUPPORTED_CHAINS } from "../constants/constants";
import { TokenBalanceResponse, QuoteResponse } from "../dto/socketDTOs";
import { Cache, chainData, userData, UserData, TokenData, tokenData, ChainData, cachebridgeData, CachebridgeData, CachebridgeDataPerChain, cachebridgeDataPerChain } from "../dto/cache";
import { ChainsData, ChainData as ChainDataDTO } from "../dto/chainsDataDTO";

export const cacheRoute = async (cache: Cache) => {
    let chainRoutes= new Map()
    const chainsData: ChainsData = SUPPORTED_CHAINS
    for (const [i, iValue] of Object.entries(SUPPORTED_CHAINS)) {
        const innerRoute: CachebridgeDataPerChain = await getRouteDataPerChain(chainsData, i, iValue, "100000000", "0xd76807Ea0409ff3b849469d9f8F23364d8CE68dE", "USDC")
        chainRoutes.set(i, getRouteDataPerChain)
    }
    cache.set("routes", Object.fromEntries(chainRoutes))
}

export const cacheUserData = async (userAddress: string, cache: Cache, tokenId: string): Promise<TokenData> => {
    let balanceMap = new Map()
    let promises = []
    let userCachedData: UserData = cache.get(userAddress)
    const _chainsData: ChainsData = SUPPORTED_CHAINS
    
    if(userCachedData === undefined) {
        userCachedData = Object.create(userData)
    }
    if(tokenId === undefined) {
        return Object.create(tokenData)
    }

    for (const [key, value] of Object.entries(_chainsData)) {
        if(value.active) {
            promises.push(new Promise(async (resolve) => {
                let response = await getBalance(value.tokens[tokenId], key, userAddress)
                if (response.status == 200) {
                    const jsonResp: TokenBalanceResponse = await response.json()
                    const tokenBalance = jsonResp.result.balance
                    balanceMap.set(key, Number(tokenBalance))
                }
                resolve({});
              })
            )
        }
    }

    await Promise.all(promises)

    userCachedData[tokenId] = {
        updatedAt: Date.now(),
        balances: Object.fromEntries(balanceMap)
    }

    cache.set(userAddress, userCachedData)
    return userCachedData[tokenId]
}

export const getRouteDataPerChain = async (chains: ChainsData, destChain: string, destChainData: ChainDataDTO, fromAmount: string, userAddress: string, tokenId: string): Promise<CachebridgeDataPerChain> => {
    let innerRoute: CachebridgeDataPerChain = Object.create(cachebridgeDataPerChain)
    let promises = []
    for (const [j, jValue] of Object.entries(chains)) {
        if(j != destChain && jValue.active) {
            promises.push(new Promise(async (resolve) => {
                let response = await getQuote(j, jValue.tokens[tokenId], destChain, destChainData.tokens[tokenId], fromAmount, userAddress)
                if(response.status == 200) {
                    let jsonResp: QuoteResponse = await response.json()
                    let minGas = 0;
                    let minTimeTaken = 0;
                    jsonResp.result.routes.forEach((data) => {
                        let curGas = data.totalGasFeesInUsd
                        if(minTimeTaken == 0 || minGas > curGas) {
                            minGas = curGas
                            minTimeTaken = data.serviceTime
                        }
                    })
                    if(minGas > 0) {
                        innerRoute[Number(j)] = {
                            bridgeCost: minGas,
                            bridgeTime: minTimeTaken
                        }
                    }
                }
                resolve({});
            }))
        }
    }
    await Promise.all(promises);
    console.log("Promise resolved")
    return innerRoute
} 

const getQuote = async (fromChainId: string, fromTokenAddress: string, toChainId: string, toTokenAddress: string, fromAmount: string, userAddress: string): Promise<Response> => {
    const getBalanceUrl = process.env.BUNGEE_BASE_URL + GET_QUOTE + "?"
    const params = new URLSearchParams()
    params.append('fromChainId', fromChainId)
    params.append('fromTokenAddress', fromTokenAddress)
    params.append('toChainId', toChainId)
    params.append('toTokenAddress', toTokenAddress)
    params.append('fromAmount', fromAmount)
    params.append('userAddress', userAddress)
    params.append('uniqueRoutesPerBridge', "true")
    params.append('sort', "gas")
    const headers = new Headers({
        'Content-Type': 'application/json',
        'API-KEY': String(process.env.BUNGEE_API_KEY)
    });  
    const response = await fetch(getBalanceUrl + params,{
        method: 'GET',
        headers: headers
    })
    return response
}

const getBalance = async (tokenAddress: string, targetChain: string, userAddress: string): Promise<Response> => {
    const getBalanceUrl = process.env.BUNGEE_BASE_URL + GET_BALANCE + "?"
    const params = new URLSearchParams()
    params.append('tokenAddress', tokenAddress)
    params.append('chainId', targetChain)
    params.append('userAddress', userAddress)
    const headers = new Headers({
        'Content-Type': 'application/json',
        'API-KEY': String(process.env.BUNGEE_API_KEY)
    });  
    const response = await fetch(getBalanceUrl + params,{
        method: 'GET',
        headers: headers
    })
    return response
}