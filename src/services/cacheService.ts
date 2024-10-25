
import { GET_BALANCE, GET_QUOTE, SUPPORTED_CHAINS } from "../constants/constants";
import { Cache } from "../dto/cache";

export const cacheRoute = async (cache: Cache) => {
    let chainRoutes= new Map()
    for (const [i, iValue] of Object.entries(SUPPORTED_CHAINS)) {
        let innerRoute = new Map()
        for (const [j, jValue] of Object.entries(SUPPORTED_CHAINS)) {
            if(j != i) {
                let response = await getQuote(j, jValue.tokens["USDC"], i, iValue.tokens["USDC"], "", "")
                if(response.status == 200) {
                    let jsonResp = await response.json()
                    let minGas = 0;
                    let minTimeTaken = 0;
                    jsonResp["result"]["routes"].forEach((obj) => {
                        let curGas = obj["totalGasFeesInUsd"]
                        if(minTimeTaken == 0 || minGas > curGas) {
                            minGas = curGas
                            minTimeTaken = obj["serviceTime"]
                        }
                    });
                    if(minGas > 0) {
                        innerRoute.set(j, {
                            "bridgeCost": minGas,
                            "bridgeTime": minTimeTaken
                        })
                    }
                }
            }
        }
        console.log(innerRoute)
        chainRoutes.set(i, Object.fromEntries(innerRoute))
    }
    console.log("finished")
    cache.set("routes", Object.fromEntries(chainRoutes))
}

export const cacheUserData = async (userAddress: string, cache: Cache) => {
    let tokenBalances = new Map()
    for (const [key, value] of Object.entries(SUPPORTED_CHAINS)) {
        if(value.active) {
            let response = await getBalance(value.tokens["USDC"], key, userAddress)
            if (response.status == 200) {
                const jsonResp = await response.json()
                const tokenBalance = jsonResp["result"]["balance"]
                tokenBalances.set(key, tokenBalance)
            }
        }
    }
    console.log(tokenBalances)
    cache.set(userAddress, Object.fromEntries(tokenBalances))
}

const getQuote = async (fromChainId: string, fromTokenAddress: string, toChainId: string, toTokenAddress: string, fromAmount: string, userAddress: string) => {
    const getBalanceUrl = process.env.BUNGEE_BASE_URL + GET_QUOTE + "?"
    const params = new URLSearchParams()
    params.append('fromChainId', fromChainId)
    params.append('fromTokenAddress', fromTokenAddress)
    params.append('toChainId', toChainId)
    params.append('toTokenAddress', toTokenAddress)
    params.append('fromAmount', "100000000")
    params.append('userAddress', "0xd76807Ea0409ff3b849469d9f8F23364d8CE68dE")
    params.append('uniqueRoutesPerBridge', "true")
    params.append('sort', "gas")
    const headers = new Headers({
        'Content-Type': 'application/json',
        'API-KEY': process.env.BUNGEE_API_KEY
    });  
    const response = await fetch(getBalanceUrl + params,{
        method: 'GET',
        headers: headers
    })
    return response
}

const getBalance = async (tokenAddress: string, targetChain: string, userAddress: string) => {
    const getBalanceUrl = process.env.BUNGEE_BASE_URL + GET_BALANCE + "?"
    const params = new URLSearchParams()
    params.append('tokenAddress', tokenAddress)
    params.append('chainId', targetChain)
    params.append('userAddress', userAddress)
    const headers = new Headers({
        'Content-Type': 'application/json',
        'API-KEY': process.env.BUNGEE_API_KEY
    });  
    const response = await fetch(getBalanceUrl + params,{
        method: 'GET',
        headers: headers
    })
    return response
}