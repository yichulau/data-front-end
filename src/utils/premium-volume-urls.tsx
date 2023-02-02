import { serverHost } from "./server-host"
export const premiumVolume = {
    urls : [
        `https://${serverHost.hostname}:3001/api/v1.0/eth/bit.com/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/bit.com/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/eth/binance/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/binance/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/eth/deribit/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/deribit/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/eth/bybit/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/bybit/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/eth/okex/volume-premium`,
        `https://${serverHost.hostname}:3001/api/v1.0/btc/okex/volume-premium`,
    ]
    
}