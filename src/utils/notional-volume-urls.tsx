import { serverHost } from "./server-host"
export const notionalVolume = {
    urls : [
        `http://${serverHost.hostname}:3001/api/v1.0/eth/bit.com/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/bit.com/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/binance/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/binance/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/deribit/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/deribit/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/bybit/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/bybit/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/eth/okex/volume-notional`,
        `http://${serverHost.hostname}:3001/api/v1.0/btc/okex/volume-notional`,
    ]
    
}