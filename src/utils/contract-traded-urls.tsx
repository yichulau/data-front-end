import { serverHost } from "./server-host"
export const contractTraded = {
    urls:[
        `https://${serverHost.hostname}/api/v1.0/eth/bit.com/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/btc/bit.com/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/eth/binance/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/btc/binance/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/eth/deribit/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/btc/deribit/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/eth/bybit/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/btc/bybit/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/eth/okex/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/btc/okex/contracts-traded`,
    ]
}
