import { serverHost } from "./server-host"
export const openInterest = {
    urls : [
        `https://${serverHost.hostname}:3001/api/v1.0/eth/bit.com/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/bit.com/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/eth/binance/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/binance/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/eth/deribit/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/deribit/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/eth/bybit/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/bybit/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/eth/okex/open-interest`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/okex/open-interest`,
    ]
    
}