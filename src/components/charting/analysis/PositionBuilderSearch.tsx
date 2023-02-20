import React, { useEffect, useState } from 'react'
import DropdownLong from '../../misc/DropdownLong'
import DropdownLargeFilter from '../../misc/DropdownLargeFilter';

const PositionBuilderSearch = ({data, handleExchangeChange, handleCurrencyChange, handleSymbolChange, handleAmountChange, handleLongShort, exchange, error, errorMessage } : any) => {
  const instrumentData = data;

  const filteredInstrumentData = instrumentData.map((item : any, index : any) => ({id: index, value: item}));
  filteredInstrumentData.sort(function(a: any,b: any){
    const aValue = a.value.split('-')
    const bValue = b.value.split('-')
    const aStrike = Number(aValue[2])
    const bStrike = Number(bValue[2])
    return aStrike - bStrike;
  })

  const handleButtonClick = (event : any)=>{
    handleLongShort(event.target.name)
  }

  const exchangeOption = [
    {id: 0, value: 'Bit.com'},
    {id: 1, value: 'Binance'},
    {id: 2, value: 'Bybit'},
    {id: 3, value: 'Deribit'},
    {id: 4, value: 'OKEX'}
  ]

  const coinCurrencyOption = [
    {id: 1, value: 'BTC'},
    {id: 2, value: 'ETH'},
    {id: 3, value: 'SOL'},
  ]

  let defaultCurrencyTitle = 'Choose Currency';
  const [currencyDropdownReset, setCurrencyDropdownReset] = useState(defaultCurrencyTitle);
  const [instrumentReset, setInstrumentReset] = useState('');
  const [currentExchange, setCurrentExchange] = useState('');  
  const [amount, setAmount] = useState(0); 
  
  // intermediate function to handle changes in exchange value before calling the callback function 
  // set all title back to the default upon detecting change in the exchange value 
  const processExchangeChange = (value: string) => {
    if (currentExchange != value) {
      var resetCode = (Math.random() * 10).toString(); // generate a varying value that triggers change of state 

      setCurrentExchange(value); // save value of current exchange 
      setCurrencyDropdownReset(resetCode); 
      setInstrumentReset(resetCode);
      setAmount(0);
      handleExchangeChange(value); // callback function from positionBuilder
    } 
  }

  // intermediate function to handle changes in amount value before calling the callback function 
  const processAmountChange = (value: number) => {
    setAmount(value);
    handleAmountChange(value); 
  } 

  return (
    <>
      <div className='mt-2 mb-2'>
          <div className='flex flex-col'>
            <h2 className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Add Simulated Position Builder</h2>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className='w-full my-1'>
              <DropdownLong title={`Choose Exchange`} options={exchangeOption} onChange={(value: any) => processExchangeChange(value)}/>
            </div>
            <div className='w-full my-1'>
              <DropdownLong title={`Choose Currency`} resetFlag={currencyDropdownReset} options={coinCurrencyOption} onChange={(value: any) => handleCurrencyChange(value)}/>
            </div>
            <div className='w-full my-1'>
              <DropdownLargeFilter title={`Instruments`} resetFlag={instrumentReset} options={filteredInstrumentData} onChange={(value: any) => handleSymbolChange(value)}  exchange={exchange}  />            
            </div>
            <div className='w-full my-1'>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
              <input type="number"
                min="0"
                value={amount}
                onChange={(event: any) => processAmountChange(event.target.value)}  
                className="bg-[#EFF2F5] border border-[#EFF2F5] font-medium text-[#58667E] text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:border-gray-900 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-700" placeholder="Enter Amount" />
            </div>
            <div className='flex flex-row w-full my-4 '>
            <button type="button"
              name='Long' 
              className="w-full md:w-1/2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleButtonClick}
            >
              Long</button>
            <button type="button" 
              name='Short' 
              className="w-full md:w-1/2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              onClick={handleButtonClick}
            >
              Short</button>
            </div>
            {error === true ? (
              <div className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50  dark:text-red-400" role="alert">
                <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Info</span>
                <div>
                  <span className="font-medium">Error!!</span> {errorMessage}
                </div>
              </div>
              
            ) : null}

          </div>
      </div>
    </>
  )
}

export default PositionBuilderSearch