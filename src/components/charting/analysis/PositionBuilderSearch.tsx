import React from 'react'
import Dropdown from '../../misc/Dropdown'
import DropdownLong from '../../misc/DropdownLong'

const PositionBuilderSearch = ({data, handleExchangeChange, handleCurrencyChange, handleSymbolChange, handleAmountChange, handleLongShort } : any) => {
  const {data: fetchData} = data;

  const filteredInstrumentData = fetchData.map((item : any, index : any) => ({id: index, value: item.instrument_id}));
  
  const handleButtonClick = (event : any)=>{
    handleLongShort(event.target.name)
  }

  const option = [
    {id: 1, value: 'Bit.com'}
  ]
  const coinCurrencyOption = [
    {id: 1, value: 'BTC'},
    {id: 2, value: 'ETH'},
]

  return (
    <>
      <div className='mt-2 mb-2'>
          <div className='flex flex-col'>
            <h2 className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Add Simulated Position Builder</h2>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className='w-full my-1'>
              <DropdownLong title={`Exchange`} options={option} onChange={(value: any) => handleExchangeChange(value)}/>
            </div>
            <div className='w-full my-1'>
              <DropdownLong title={`Currency`} options={coinCurrencyOption} onChange={(value: any) => handleCurrencyChange(value)}/>
            </div>
            <div className='w-full my-1'>
              <DropdownLong title={`Instruments`} options={filteredInstrumentData} onChange={(value: any) => handleSymbolChange(value)}  />
            </div>
            <div className='w-full my-1'>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
              <input type="number"
                onChange={(event: any) => handleAmountChange(event.target.value)}  
                className="bg-[#EFF2F5] border border-[#EFF2F5] font-medium text-[#58667E] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:border-gray-900 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-700" placeholder="Enter Amount" />
            </div>
            <div className='flex flex-row w-full my-4 '>
            <button type="button"
              name='Long' 
              className="w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleButtonClick}
            >
              Long</button>
            <button type="button" 
              name='Short' 
              className="w-full focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={handleButtonClick}
            >
              Short</button>
            </div>
          </div>
      </div>
    </>
  )
}

export default PositionBuilderSearch