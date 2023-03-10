import { serverHost } from "./server-host"
export const notionalVolume = {
    urls : [
        `https://${serverHost.hostname}/api/v1.0/eth/bit.com/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/btc/bit.com/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/eth/binance/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/btc/binance/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/eth/deribit/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/btc/deribit/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/eth/bybit/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/btc/bybit/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/eth/okex/volume-notional`,
        `https://${serverHost.hostname}/api/v1.0/btc/okex/volume-notional`,
    ]
    
}