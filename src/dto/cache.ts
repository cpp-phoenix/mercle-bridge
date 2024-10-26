import { t } from 'elysia'

export class Cache {
    private cache;
    constructor() {
      this.cache = new Map();
    }
  
    get(key: string) {
      return this.cache.get(key);
    }
  
    set(key: string, value: any) {
      this.cache.set(key, value);
    }
  
    delete(key: string) {
      this.cache.delete(key);
    }
  
    clear() {
      this.cache.clear();
    }
  }


const tokenData = t.Object({
    updatedAt: t.Number(),
    balances: t.Record(t.Number(), t.Number())
})

type TokenData = typeof tokenData.static

const userData = t.Record(t.String(), tokenData
)

type UserData = typeof userData.static

const cachebridgeData = t.Object({
    bridgeCost: t.Number(),
    bridgeTime: t.Number()
})

type CachebridgeData = typeof cachebridgeData.static

const cachebridgeDataPerChain = t.Record(
    t.Number(), cachebridgeData
)

type CachebridgeDataPerChain = typeof cachebridgeDataPerChain.static

const chainData = t.Record(t.Number(), cachebridgeDataPerChain)

type ChainData = typeof chainData.static

export { userData, UserData, tokenData, TokenData, chainData, ChainData, cachebridgeData, CachebridgeData, cachebridgeDataPerChain, CachebridgeDataPerChain }
