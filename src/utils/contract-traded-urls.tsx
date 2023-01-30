import { serverHost } from "./server-host"
export const contractTraded = {
    urls:[
        `http://${serverHost.hostname}:3001/api/v1.0/eth/bit.com/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/bit.com/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/binance/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/binance/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/deribit/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/deribit/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/bybit/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/bybit/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/okex/contracts-traded`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/okex/contracts-traded`,
    ]
}
