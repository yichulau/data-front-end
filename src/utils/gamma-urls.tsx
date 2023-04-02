import { serverHost } from "./server-host"
export const gammaUrls = {
    urls : [
        `https://${serverHost.hostname}/api/v1.0/eth/bybit/gamma`,
        `https://${serverHost.hostname}/api/v1.0/btc/bybit/gamma`,
        `https://${serverHost.hostname}/api/v1.0/eth/deribit/gamma`,
        `https://${serverHost.hostname}/api/v1.0/btc/deribit/gamma`,
        `https://${serverHost.hostname}/api/v1.0/eth/okex/gamma`,
        `https://${serverHost.hostname}/api/v1.0/btc/okex/gamma`,
        `https://${serverHost.hostname}/api/v1.0/eth/bit.com/gamma`,
        `https://${serverHost.hostname}/api/v1.0/btc/bit.com/gamma`,
        `https://${serverHost.hostname}/api/v1.0/eth/binance/gamma`,
        `https://${serverHost.hostname}/api/v1.0/btc/binance/gamma`,
    ]
    
}