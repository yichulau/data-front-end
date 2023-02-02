import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import BarChart from '../components/charting/BarChart'
import ChartingCard from '../components/charting/ChartingCard'

const Home: NextPage = () => {
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
