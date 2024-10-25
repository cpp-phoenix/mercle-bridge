import { t } from 'elysia'
import { BridgeRequest } from "../dto/bridgeRequest"
import { BridgeResponse, bridgeResponse } from "../dto/bridgeResponse";
import { SUPPORTED_CHAINS } from "../constants/constants";
import { Cache } from '../dto/cache';

export const getBridgePaths = async (request: BridgeRequest, cache: Cache) : Promise<BridgeResponse> => {
    const cacheBalance = cache.get(request.userAddress)
    console.log(cacheBalance)
    console.log(cacheBalance[request.targetChain])
    if(cacheBalance !== undefined && cacheBalance[request.targetChain] !== undefined) {
        const destBalance = cacheBalance[request.targetChain]
        if(request.amount == 0 || destBalance >= request.amount) {
            let resp = Object.create(bridgeResponse)
            resp.status = true
            resp.message = "sufficient balance"
            return resp
        } else {
            let remainingBalance =  request.amount - destBalance
            let userData = new Map();

            // //!!!!!!!!!!!!!!!!!!!!!Assumtion based Testing!!!!!!!!!!!!!!!!!!!!!
            // let remainingBalance = 50
            // userData.set(42161, {"userBalance":100,"bridgeCost":1,"bridgeTime":2})
            // userData.set(8453, {"userBalance":80,"bridgeCost":0.5,"bridgeTime":1})
            // userData.set(100, {"userBalance":25,"bridgeCost":0.1,"bridgeTime":1})
            // userData.set(81457, {"userBalance":30,"bridgeCost":0.2,"bridgeTime":3})
            // //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            const cacheRoutes = cache.get("routes")
            for (const [key, value] of Object.entries(SUPPORTED_CHAINS)) {
                if(value.active && Number(key) != request.targetChain) {
                    if(cacheBalance !== undefined && cacheBalance[key] !== undefined) {
                        let cacheBalancePerChain = cacheBalance[key]
                        if(cacheBalancePerChain > 0) {
                            if(cacheRoutes[request.targetChain] !== undefined && cacheRoutes[request.targetChain][key] !== undefined) {
                                userData.set(key, {
                                    "userBalance": cacheBalancePerChain,
                                    "bridgeCost": cacheRoutes[request.targetChain][key]["bridgeCost"],
                                    "bridgeTime": cacheRoutes[request.targetChain][key]["bridgeTime"]
                                })
                            }
                        }
                    }
                }
            }
            const [fee, _time, path] = calculateRoute(Array.from(userData.keys()), remainingBalance, userData)
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

const calculateRoute = ( chainIds: number[], remainingBalance: number, userData: Map<number, {}>) => {
    let minGasUsed = -1
    let minTime = 0
    let optimalPath = {}
    
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

const calculateRouteRecursive = (index: number, length: number, chainIds: number[], remainingBalance: number, userData: Map<number, {}>): [number, number, []] => {
    let minGasUsed = -1
    let totalTime = 0
    let optimalPath = []
    let curChain = chainIds[index]
    let _userData = userData.get(curChain)
    let curBalance = _userData["userBalance"]
    if(curBalance == undefined) {
        curBalance = 0
    }
    // let curFee = bridgeCosts.get(curChain)
    let curFee = _userData["bridgeCost"]
    if(curFee == undefined) {
        curFee = 0
    }
    let curTime = _userData["bridgeTime"]
    if(curTime == undefined) {
        curTime = 0
    }
    let curArray = []
    curArray.push({
        "chain": SUPPORTED_CHAINS[curChain].name,
        "chainId": curChain,
        "amount": curBalance,
        "serviceTime": curTime,
        "fee": curFee
    })
    if(remainingBalance <= curBalance) {
        return [curFee, curTime, curArray]
    }

    if(index == length - 1) {
        return [-1, {}];
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
        return [-1, []]
    } else {
        optimalPath.push(curArray[0])
        return [minGasUsed + curFee, totalTime + curTime,  optimalPath]
    }
}
