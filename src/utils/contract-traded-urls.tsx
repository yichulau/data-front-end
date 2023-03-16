import { serverHost } from "./server-host"
export const contractTraded = {
    urls:[
        `https://${serverHost.hostname}/api/v1.0/eth/bit.com/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/btc/bit.com/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/eth/binance/contracts-traded`,
        `https://${serverHost.hostname}/api/v1.0/btc/binance/contracts-traded`,
    ]
}
