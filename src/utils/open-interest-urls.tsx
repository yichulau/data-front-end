import { serverHost } from "./server-host"
export const openInterest = {
    urls : [
        `http://${serverHost.hostname}/api/v1.0/eth/bit.com/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/btc/bit.com/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/eth/binance/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/btc/binance/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/eth/deribit/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/btc/deribit/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/eth/bybit/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/btc/bybit/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/eth/okex/open-interest`,
        `http://${serverHost.hostname}/api/v1.0/btc/okex/open-interest`,
    ]
    
}