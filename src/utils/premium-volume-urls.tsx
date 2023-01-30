import { serverHost } from "./server-host"
export const premiumVolume = {
    urls : [
        `http://${serverHost.hostname}:3001/api/v1.0/eth/bit.com/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/bit.com/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/binance/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/binance/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/deribit/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/deribit/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/bybit/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/bybit/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/okex/volume-premium`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/okex/volume-premium`,
    ]
    
}