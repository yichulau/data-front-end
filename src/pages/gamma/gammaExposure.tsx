import React, { ChangeEvent, MouseEvent , useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout';
import GammaTable from '../../components/gamma/GammaTable';
import { gammaUrls } from '../../utils/gamma-urls';
import useFetchGamma from '../../hooks/useFetchGamma';
import { gammaCoinExchangeOption, exchangeOption } from '../../utils/selector';
import GammaFilterDropdown from '../../components/gamma/GammaFilterDropdown';
import AbsoluteGammaExposureChart from '../../components/gamma/AbsoluteGammaExposureChart';
import { serverHost } from '../../utils/server-host';
import ribbonImg from "../../../public/assets/ribbon-logo.png";

import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import AbsoluteGammaCallsPutsChart from '../../components/gamma/AbsoluteGammaCallsPutsChart';


import GammaExposureProfileChart from '../../components/gamma/GammaExposureProfileChart';
import { calculateAbsoluteGammaExposure, calculateZeroGammaLevel } from '../../utils/gammaExposureCalculation';
import Image from 'next/image';


const GammaExposure = () => {
    const urls = gammaUrls.urls
    const ResponsiveGridLayout : any = useMemo(() => WidthProvider(Responsive), []);
    const {data , error, loading } = useFetchGamma(urls);
    const [currency, setCurrency] = useState('')
    const [exchange, setExchange] = useState('')
    const [filterData, setFilterData] = useState([])  
    const [spotPrice, setSpotPrice] = useState(0)
    const [dfAgg, setDfAgg] = useState()
    const [strikes, setStrikes] = useState()
    const [width, setWidth] = useState<any>(undefined);
    const [zeroGammaLevelData, setZeroGammaLevelData] = useState({})
    const [errorFlag, setErrorFlag] = useState(false)
    const [layouts, setLayout] = useState<any>([
        { i: 'table1', x: 0, y: 1, w: 6, h: 13, minW: 4 },
        { i: 'table2', x: 6, y: 1, w: 6, h: 13, minW: 4 },
        { i: 'table3', x: 0, y: 0, w: 12, h: 13, minW: 4 },
        { i: 'table4', x: 0, y: 2, w: 12, h: 24, minW: 4 },
    ]);


   const getSpotPrice = (value: string) =>{
    let spotVal = `https://${serverHost.hostname}/api/v1.0/${value.toLowerCase()}/spotval`;
    return fetch(spotVal)
        .then(response => {
        if (!response.ok) {
            const message = `An error has occurred: ${response.status}`;
            throw new Error(message);
        }
            return response.json();
        })
        .then(data => {
            setSpotPrice(data.spotValue)
            return data;
        })
        .catch(error => {
        throw new Error(error.message);
        });
   }

   const onClickFilter = (event: MouseEvent<HTMLButtonElement>) =>{
    event.preventDefault()

    if(currency && exchange){
        setErrorFlag(false)
        const filterDataSet : any = data.filter((obj) => obj.currency === currency.toLowerCase() && obj.exchange === exchange.toLowerCase())
        const {dfAgg, strikes} = calculateAbsoluteGammaExposure(filterDataSet, spotPrice)
        const zeroGammaLevel = calculateZeroGammaLevel(filterDataSet,  spotPrice)


        setDfAgg(dfAgg)
        setStrikes(strikes)
        setZeroGammaLevelData(zeroGammaLevel)
        setFilterData(filterDataSet)
    } else{
        setErrorFlag(true)
    }
   }

   useEffect(()=>{
        if (typeof window !== 'undefined') {
        window.onresize = () => {
            setWidth(window.innerWidth);
        }
        setWidth(() => window.innerWidth);
        }
    },[])
  
   
  return (
    <>
    <div className="container py-1 mx-auto">
        <div className={strikes && dfAgg ? `w-full px-2.5` : `w-full`}>
            <div className='flex flex-col bg-white dark:bg-black rounded-lg shadow-sm w-full px-4 py-4 '>
                <div className='flex gap-2'>
                    <GammaFilterDropdown 
                        title={`Coin Currency`}
                        options={gammaCoinExchangeOption}
                        onChange={(value:any) => {
                            getSpotPrice(value)
                            setCurrency(value)
                        }}
                    />
                    <GammaFilterDropdown 
                        title={`Exchange`}
                        options={exchangeOption}
                        onChange={(value: any) => setExchange(value)}
                    />
                    <button
                        className='text-white bg-green-700 hover:bg-green-800  font-medium rounded-lg text-xs md:text-sm px-4 md:px-5 py-2.5 text-center mr-2 mb-2'
                        onClick={onClickFilter}
                    >
                        Submit
                    </button>
                </div>
                {errorFlag ? (
                    <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                        <span className="font-medium">Error Alert!</span> Please Make Sure Exchange and Currency Is Selected And Try Submitting Again.
                    </div>
                ): null }
            </div>

        </div> 
        <div className='w-full'>
            {strikes && dfAgg ? (
                <>  
                {width > 764 ? (
                    <div className='w-full'>
                        <ResponsiveGridLayout
                            className="layout"
                            layouts={{ lg: layouts }}
                            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                            cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                            rowHeight={30}
                            margin={[10, 10]}
                            isResizable={true}
                            isDraggable={true}
                            draggableHandle=".drag-handle"
                            onLayoutChange={(newLayout: any ) => {
                                setLayout(newLayout)
                            }}
                            useCSSTransforms={false}
                        >
                            <div key="table3" className="grid-item">
                                <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                    <div className="overflow-x-auto scrollbar-none md:w-full ">
                                        <GammaExposureProfileChart 
                                            zeroGammaLevelData={zeroGammaLevelData}
                                            spotPrice={spotPrice}
                                            currency={currency}
                                            exchange={exchange}
                                            width={width}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div key="table1" className="grid-item">
                                <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                    <div className="overflow-x-auto scrollbar-none md:w-full ">
                                        <AbsoluteGammaExposureChart 
                                            strikes={strikes}
                                            dfAgg={dfAgg}
                                            spotPrice={spotPrice}
                                            currency={currency}
                                            exchange={exchange}
                                            width={width}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div key="table2" className="grid-item">
                                <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                    <div className="overflow-x-auto scrollbar-none md:w-full ">
                                        <AbsoluteGammaCallsPutsChart 
                                            strikes={strikes}
                                            dfAgg={dfAgg}
                                            spotPrice={spotPrice}
                                            currency={currency}
                                            exchange={exchange}
                                            width={width}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div key="table4" className="grid-item">
                                <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                                <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                                    <div className="overflow-x-auto scrollbar-none md:w-full ">
                                        <GammaTable data={filterData} loading={loading} spotPrice={spotPrice} currency={currency} width={width}/>
                                    </div>
                                </div>
                            </div>
                        </ResponsiveGridLayout>
                    </div>
                ) : null }
                {width <= 764 ? (
                    <>
                        <div className='w-full px-1'>
                            <GammaExposureProfileChart 
                                zeroGammaLevelData={zeroGammaLevelData}
                                spotPrice={spotPrice}
                                currency={currency}
                                exchange={exchange}
                                width={width}
                            />
                            <AbsoluteGammaExposureChart 
                                strikes={strikes}
                                dfAgg={dfAgg}
                                spotPrice={spotPrice}
                                currency={currency}
                                exchange={exchange}
                                width={width}
                            />
                            <AbsoluteGammaCallsPutsChart 
                                strikes={strikes}
                                dfAgg={dfAgg}
                                spotPrice={spotPrice}
                                currency={currency}
                                exchange={exchange}
                                width={width}
                            />
                        </div>
                        <div className='flex'>
                            <GammaTable data={filterData} loading={loading} spotPrice={spotPrice} currency={currency} width={width}/>
                        </div>
                    
                    </>
                ): null }
                </>
            ) : (
                <div className='w-full my-2'>
                    <div className='flex flex-wrap bg-white dark:bg-black w-full h-screen items-center justify-center rounded-lg shadow-sm px-4 py-4'>
                        <div className="py-8 px-4 mx-auto max-w-screen-md text-center items-center justify-center lg:py-16 lg:px-12">
                            <Image className='w-24 h-24 mx-auto ' src={ribbonImg} alt="ribbon_logo"></Image>
                            <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 lg:mb-6 md:text-5xl xl:text-6xl dark:text-white">No Selection Made Yet.</h1>
                            <p className="font-light text-gray-500 md:text-lg xl:text-xl dark:text-gray-400">Please Choose Your Preferred Currency & Exchange.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
        
    </>
  )
}

export default GammaExposure

