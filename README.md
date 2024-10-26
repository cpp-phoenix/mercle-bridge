# Description

**Endpoint**: /bridge

**Details**: The api calculates the most efficient route and returns the route array containing the chains and bridge amounts. It expects the user balances and route details to be cached already.

**Request**: GET

**Params**: userAddress, targetChain, amount, tokenAddress
(The amount is taken in wei)

**curl**: curl --location '{URL}:3000/bridge?userAddress=0xb98c92DaA7B4ecd94513c2b84AE2f57691412348&targetChain=137&amount=100&tokenAddress=0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359' \
--data ''

**Response**: 
```json
{
    "status": true,
    "totalFee": 0.0012066595267973628,
    "totalServiceTime": 1560,
    "route": [
        {
            "chain": "Optimism",
            "chainId": "10",
            "amount": "16021087",
            "serviceTime": 1560,
            "fee": 0.0012066595267973628
        }
    ]
}
```

## 

**Endpoint**: /cache-routes

**Details**: The api which should be called by the schedular on regular interval to have update costs of bridging between chains

**Request**: POST

**curl**: curl --location --request POST '{URL}:3000/cache-routes'

**Response**: 
```json
success
```

## 

**Endpoint**: /get-routes

**Details**: The api returns the cached bridging routes

**Request**: Get

**curl**: curl --location '{URL}:3000/get-routes'

**Response**: 
```json
{
    "1": {
        "10": {
            "bridgeCost": 0.0012066595267973628,
            "bridgeTime": 1740
        },
        "100": {
            "bridgeCost": 1.877718249538168,
            "bridgeTime": 120
        },
        "137": {
            "bridgeCost": 0.002001452402866094,
            "bridgeTime": 900
        },
        "324": {
            "bridgeCost": 0.0137254653,
            "bridgeTime": 120
        },
        "8453": {
            "bridgeCost": 0.0017177812123542,
            "bridgeTime": 1380
        },
        "59144": {
            "bridgeCost": 0.094247504489628,
            "bridgeTime": 60
        }
    }
}
```

##

**Endpoint**: /cache-user-balance

**Details**: It should be called when user is checking it's balance before bridge api call

**Request**: POST

**Body**: 
```json
{
    "userAddress": "0xb98c92DaA7B4ecd94513c2b84AE2f57691412348",
    "tokenId": "USDC"
}
```

**curl**: curl --location '{URL}:3000/cache-user-balance' \
--header 'Content-Type: application/json' \
--data '{
    "userAddress": "0xb98c92DaA7B4ecd94513c2b84AE2f57691412348",
    "tokenId": "USDC"
}'

**Response**: 
```json
success
```

##

**Endpoint**: /get-user-balance

**Details**: The api returns the cached token balance of user in all chains

**Request**: GET

**Params**: userAddress

**curl**: curl --location '{URL}:3000/get-user-balance?userAddress=0xb98c92DaA7B4ecd94513c2b84AE2f57691412348'

**Response**: 
```json
{
    "USDC": {
        "updatedAt": 1729955065481,
        "balances": {
            "1": 0,
            "10": 16021087,
            "100": 0,
            "137": 0,
            "324": 0,
            "1101": 600993,
            "8453": 0,
            "43114": 0,
            "59144": 0,
            "81457": 0,
            "534352": 0,
            "1313161554": 0
        }
    }
}
```

#

### I've tested the Api for provided sample input

<img width="1087" alt="Screenshot 2024-10-25 at 2 55 55 AM" src="https://github.com/user-attachments/assets/5ba51e27-b062-4315-a2ea-bfbdce236247">


## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.
