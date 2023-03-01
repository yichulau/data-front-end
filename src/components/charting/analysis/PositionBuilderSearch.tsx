import React, { useEffect, useMemo, useState } from 'react'
import DropdownLong from '../../misc/DropdownLong'
import DropdownLargeFilter from '../../misc/DropdownLargeFilter';

const PositionBuilderSearch = ({
  data, 
  handleExchangeChange, 
  handleCurrencyChange, 
  handleSymbolChange, 
  handleAmountChange, 
  handleLongShort, 
  exchange, 
  error, 
  errorMessage, instrumentLoading } : any) => {

  const instrumentData = data;
  const filteredInstrumentData = instrumentData.map((item : any, index : any) => ({id: index, value: item}));
  const isLoading = useMemo(() => instrumentLoading, [instrumentLoading]);
  filteredInstrumentData.sort(function(a: any,b: any){
    const aValue = a.value.split('-')
    const bValue = b.value.split('-')
    const aStrike = Number(aValue[2])
    const bStrike = Number(bValue[2])
    return aStrike - bStrike;
  })

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
    // {id: 3, value: 'SOL'},
  ]

  let defaultCurrencyTitle = 'Choose Currency';
  let defaultExchangeTitle = 'Choose Exchange'; 
  const [exchangeDropdownReset, setExchangeDropdownReset] = useState(defaultExchangeTitle); 
  const [currencyDropdownReset, setCurrencyDropdownReset] = useState(defaultCurrencyTitle);
  const [instrumentReset, setInstrumentReset] = useState('');
  const [currentExchange, setCurrentExchange] = useState('');  
  const [amount, setAmount] = useState(0); 
  const [state, setState] = useState({
    currency : null,
    symbol: null,
    exchange: null,
    amount: 0
  })
  
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

  const handleButtonClick = (event : any)=>{
    const {currency, symbol, exchange, amount} = state
    handleLongShort(event.target.name, currency, symbol, exchange, amount)
  }

  const handleResetButtonClick = (event : any)=>{
    var resetCode = (Math.random() * 10).toString();
    handleExchangeChange(''); // set exchange value to empty string 

    setExchangeDropdownReset(resetCode);
    setCurrencyDropdownReset(resetCode);
    setInstrumentReset(resetCode); 
    setAmount(0);
  }

  return (
    <>
      <div className='mt-2 mb-2 h-[650px] md:h-auto'>
          <div className='flex flex-col'>
            <h2 className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Add Simulated Position Builder</h2>
            <hr className="h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>
            <div className='w-full my-1'>
              <DropdownLong title={`Choose Exchange`} 
                resetFlag={exchangeDropdownReset}
                options={exchangeOption} 
                onChange={(value: any) => {
                  processExchangeChange(value)
                  setState(prevState => ({ ...prevState, exchange: value }));
                }}
              />
            </div>
            <div className='w-full my-1'>
              <DropdownLong title={`Choose Currency`} resetFlag={currencyDropdownReset} options={coinCurrencyOption} 
                onChange={(value: any) => {
                  handleCurrencyChange(value)
                  setState(prevState => ({ ...prevState, currency: value }));
                }}
              />
            </div>
            <div className='w-full my-1'>
              <DropdownLargeFilter title={`Instruments`} resetFlag={instrumentReset} options={filteredInstrumentData} 
                onChange={(value: any) => {
                  handleSymbolChange(value)
                  setState(prevState => ({ ...prevState, symbol: value }));
                }}  
                exchange={exchange}
                state={state}
                />            
            </div>
            <div className='w-full my-1'>
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Amount</label>
              <input type="number"
                min="0"
                value={amount}
                onChange={(event: any) => {
                  processAmountChange(event.target.value)
                  setState(prevState => ({ ...prevState, amount: event.target.value }));
                }}  
                className="bg-[#EFF2F5] border border-[#EFF2F5] font-medium text-[#58667E] text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:text-bg-gray-700 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:border-gray-900 dark:placeholder-gray-400 dark:text-white dark:focus:bg-gray-700" placeholder="Enter Amount" />
            </div>
            <div className='flex flex-row w-full my-4 '>
              {isLoading ? (
                  <button type="button"
                    disabled={true}
                    name='Long' 
                    className="w-full md:w-1/2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-xs px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                  >
                     <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Loading...
                  </button>
              ) : (
                  <button type="button"
                    name='Long' 
                    className="w-full md:w-1/2 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    onClick={handleButtonClick}
                  >
                    Long</button>
              )}
              {isLoading ? (
                  <button type="button"
                    disabled={true}
                    name='Long' 
                    className="w-full md:w-1/2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  >
                     <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    Loading...
                  </button>
              ) : (
                  <button type="button" 
                    name='Short' 
                    className="w-full md:w-1/2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    onClick={handleButtonClick}
                  > 
                  Short</button>
              )}


            </div>
            <div className='w-full my-1'>
                <button type="button" 
                  className="text-gray-900 w-full bg-[#EFF2F5] border focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2.5 py-2.5  mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={handleResetButtonClick}
                >
                  Reset Fields
                </button>
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