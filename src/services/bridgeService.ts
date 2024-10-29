import { t } from 'elysia'
import { BridgeRequest } from "../dto/bridgeRequest"
import { BridgeResponse, bridgeResponse, RouteData } from "../dto/bridgeResponse";
import { cacheUserData, getRouteDataPerChain } from './cacheService';
import { SUPPORTED_CHAINS } from "../constants/constants";
import { Cache, CachebridgeDataPerChain } from '../dto/cache';
import { userData, UserData, TokenData, ChainData, CachebridgeData } from "../dto/cache";
import { ChainsData, chainsData, ChainBridgeData, chainBridgeData, bridgeData, BridgeData } from '../dto/chainsDataDTO';

export const getBridgePaths = async (request: BridgeRequest, cache: Cache) : Promise<BridgeResponse> => {
    let cacheBalance: UserData = cache.get(request.userAddress)
    const chainsData: ChainsData = SUPPORTED_CHAINS
    let tokenId = chainsData[request.targetChain].tokenIds[request.tokenAddress]

    if(tokenId === undefined) {
        let resp = Object.create(bridgeResponse)
        resp.status = false
        resp.message = "invalid token address"
        return resp
    }

    let cacheBalancePerToken: TokenData;

    if(cacheBalance === undefined || cacheBalance[tokenId] === undefined || (Date.now() - cacheBalance[tokenId].updatedAt) > Number(process.env.CACHE_BALANCE_EXPIRATION)) {
        cacheBalancePerToken = await cacheUserData(request.userAddress, cache, tokenId)
    } else {
        cacheBalancePerToken = cacheBalance[tokenId]
    }

    if(cacheBalancePerToken !== undefined && cacheBalancePerToken.balances[request.targetChain] !== undefined) {
        const destBalance = cacheBalancePerToken.balances[request.targetChain]
        if(request.amount == 0 || destBalance >= request.amount) {
            let resp = Object.create(bridgeResponse)
            resp.status = true
            resp.message = "sufficient balance"
            return resp
        } else {
            let remainingBalance =  request.amount - destBalance
            let userData = await getUserBridgeData(request.targetChain.toString(), request.userAddress, cacheBalancePerToken, tokenId)
            const [fee, _time, path] = calculateRoute(Object.keys(userData), remainingBalance, userData)
            let resp = Object.create(bridgeResponse)
            resp.status = true
            resp.totalFee = fee
            resp.totalServiceTime = _time
            resp.route = path
            return resp
        }
    }

    let resp = Object.create(bridgeResponse)
    resp.status = false
    resp.message = "downstream service error"
    return resp
}

const getUserBridgeData = async (destChain: string, userAddress: string, userBalances: TokenData, tokenId: string) => {
    let userData: ChainBridgeData = Object.create(chainBridgeData)
    let chains: ChainsData = Object.create(chainsData)
    const _chainsData: ChainsData = SUPPORTED_CHAINS
    for (const [key, value] of Object.entries(_chainsData)) {
        if(value.active && key != destChain) {
            if(userBalances !== undefined && userBalances.balances[Number(key)] !== undefined) {
                let cacheBalancePerChain = userBalances.balances[Number(key)]
                if(cacheBalancePerChain > 0) {
                    chains[Number(key)] = value
                }
            }
        }
    }
    let cacheRoutes: CachebridgeDataPerChain = await getRouteDataPerChain(chains, destChain, _chainsData[Number(destChain)], "100000000", userAddress, tokenId)

    for (const [key, value] of Object.entries(chains)) {
        let numKey = Number(key)
        if(cacheRoutes !== undefined && cacheRoutes[numKey] !== undefined) {
            userData[numKey] = {
                userBalance: userBalances.balances[numKey],
                bridgeCost: cacheRoutes[numKey].bridgeCost,
                bridgeTime: cacheRoutes[numKey].bridgeTime
            }
        }
    }
    return userData
}

const calculateRoute = ( chainIds: string[], remainingBalance: number, userData: ChainBridgeData): [number, number, Array<RouteData>] => {
    let minGasUsed = -1
    let minTime = 0
    let optimalPath: Array<RouteData> = []

    for(let i=0; i< chainIds.length; i++) {
        const [gasUsed, time, path] = calculateRouteRecursive(i, chainIds.length, chainIds, remainingBalance, userData)
        if((gasUsed != -1) && (minGasUsed == -1 || gasUsed < minGasUsed)) {
            minGasUsed = gasUsed
            minTime = time
            optimalPath = path
        }
    }

    return [minGasUsed, minTime, optimalPath]
}

const calculateRouteRecursive = (index: number, length: number, chainIds: string[], remainingBalance: number, userData: ChainBridgeData): [number, number, Array<RouteData>] => {
    let minGasUsed = -1
    let totalTime = 0
    let optimalPath: Array<RouteData> = []
    let curChain: number = Number(chainIds[index])
    let _userData: BridgeData = userData[curChain]
    const chainsData: ChainsData = SUPPORTED_CHAINS
    let curBalance = _userData["userBalance"]

    if(curBalance == undefined) {
        curBalance = 0
    }

    let curFee = _userData["bridgeCost"]
    if(curFee == undefined) {
        curFee = 0
    }
    let curTime = _userData["bridgeTime"]
    if(curTime == undefined) {
        curTime = 0
    }
    let curArray = []
    if(remainingBalance <= curBalance) {
        curArray.push({
            "chain": chainsData[curChain].name,
            "chainId": curChain,
            "amount": remainingBalance,
            "serviceTime": curTime,
            "fee": curFee
        })
        return [curFee, curTime, curArray]
    }

    curArray.push({
        "chain": chainsData[curChain].name,
        "chainId": curChain,
        "amount": curBalance,
        "serviceTime": curTime,
        "fee": curFee
    })

    if(index == length - 1) {
        return [-1, -1 ,[]];
    }
    for(let i=index; i< length - 1; i++) {
        const [gasUsed, _time, path] = calculateRouteRecursive(i+1, length, chainIds, remainingBalance - curBalance, userData)
        if((gasUsed != -1) && (minGasUsed == -1 || gasUsed < minGasUsed)) {
            minGasUsed = gasUsed
            totalTime = _time
            optimalPath = path
        }
    }   
    if(minGasUsed == -1) {
        return [-1, -1, []]
    } else {
        optimalPath.push(curArray[0])
        return [minGasUsed + curFee, totalTime + curTime,  optimalPath]
    }
}
