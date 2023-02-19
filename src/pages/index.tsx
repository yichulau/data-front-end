import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import BarChart from '../components/charting/BarChart'
import ChartingCard from '../components/charting/ChartingCard'
import { useEffect, useState } from 'react'

const Home: NextPage = () => {
  async function fetchSpotData(currencies : any) {
    const url = `https://api4.binance.com/api/v3/ticker/price?symbol=${currencies}USDT`
    const response = await fetch(url)
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const data = response.json()
    return data
  }


  useEffect(()=>{
    const fetchAllSpotData = async () =>{
      const {price: btcSpotVal }= await fetchSpotData('BTC');
      const {price: ethSpotVal } = await fetchSpotData('ETH');
      const {price: solSpotVal }= await fetchSpotData('SOL');

      localStorage.setItem("btc", btcSpotVal)
      localStorage.setItem("eth", ethSpotVal)
      localStorage.setItem("sol", solSpotVal)
    }

    fetchAllSpotData()

  },[])


  return (
    <div className={styles.container}>
      <Head>
        <title>Ribbon Dashboard</title>
        <meta name="description" content="Ribbon Dashboard" />
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" /> 
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col justify-center items-center">
        <div className="grid gap-8 lg:grid-cols-2 w-full mt-4 mb-4">
          {/* <ChartingCard option="BarChart"/> */}
          <ChartingCard option="StackedBarChart"/>
          <ChartingCard option="StackedLineChart"/>
          <ChartingCard option="LineChartVolume"/>
          <ChartingCard option="LineChartOI" />
        </div>  
 
      </main>
    </div>
  )
}

export default Home
