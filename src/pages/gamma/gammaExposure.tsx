import React, { useEffect, useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout';
import GammaTable from '../../components/gamma/GammaTable';


const gammaExposure = () => {


  return (
    <>
        <div className='flex flex-wrap'>
            {/* filter container */}
            {/* <div className='flex flex-row '>
                <div className='bg-white dark:bg-black shadow-sm rounded-md'>
                    <h2>Some</h2>
                    <h2>Some</h2>
                    <h2>Some</h2>
                </div>
            </div> */}
            <div className='flex'>
                <GammaTable />
            </div>
        </div>
    </>
  )
}

export default gammaExposure