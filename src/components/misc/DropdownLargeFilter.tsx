import React, { useState, useRef, useEffect, Fragment, useMemo } from 'react'
import listenForOutsideClicks from '../../utils/listen-for-outside-clicks';

const DropdownLargeFilter = ({title, resetFlag, options, onChange} : any) => {
    let initialTitle = title;
    const [selectedOption, setSelectedOption] = useState(initialTitle);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [filterDate, setFilterDate] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [filterStrike, setFilterStrike] = useState([]);
    const [selectedStrike, setSelectedStrike] = useState('');

    const toggleOptions = () => {
      setIsOpen(!isOpen);
    };
    const menuRef = useRef(null);
    const [listening, setListening] = useState(false);
    const selectOption = (option: any) => {
      setSelectedOption(option);
      setIsOpen(false);
      onChange(option);
    };
    
    const getOptionsByDate = (date: string) => {
        setSelectedDate(date)
        setFilteredOptions(
          options.filter((option : any) => option.value.includes(date))
        );
    };

    const handleStrikePriceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStrikePrice = event.target.value;
        setSelectedStrike(selectedStrikePrice);
      
        if (selectedStrikePrice === 'All Strike Price') {
          setFilteredOptions(options);
        } else {
          const filteredByStrike = options.filter((option: any) =>
            option.value.includes(selectedStrikePrice)
          );
          setFilteredOptions(filteredByStrike);
        }
      };

    // to handle scenarios to clear the field
    useEffect(
        () => {
          setSelectedOption(initialTitle); 
        },
        [resetFlag]
    );

    useEffect(listenForOutsideClicks(listening, setListening, menuRef, setIsOpen));

    useEffect(() => {
        const dates : any = Array.from(new Set(options.map((obj: any) => obj.value.split("-")[1]))).sort((a: any, b: any) => a.localeCompare(b));
        const strike : any = Array.from(new Set(options.map((obj: any) => obj.value.split("-")[2]))).sort((a: any, b: any) => Number(a) - Number(b));

        setFilterDate(dates);
        setFilterStrike(strike)
    }, [options]);
  
    useMemo(() => {
        const filteredByDate = filterDate.reduce((filtered: any) => {
            const dateOptions = options.filter((option: any) => option.value.includes(selectedDate));
            let filteredOptions = dateOptions.filter((option: any) =>
                option.value.toLowerCase().includes(searchQuery.toLowerCase())
            );
            if (selectedStrike && selectedStrike !== 'All Strike Price') {
                filteredOptions = dateOptions.filter((option: any) =>
                    option.value.includes(selectedStrike)
                );
            }
            return filteredOptions.length > 0 ? [ ...filteredOptions] : filtered;
        }, []);

        setFilteredOptions(filteredByDate);
    }, [options, filterDate, searchQuery, filterStrike, selectedStrike, selectedDate]);


  

  return (
    <>
       
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> {title}</label>
        <div ref={menuRef}>
            <button 
                onClick={toggleOptions}
                className="text-[#58667E] w-full bg-[#EFF2F5] hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">{selectedOption}<svg className="w-4 h-4 ml-2 float-right" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
            {isOpen && (
                    <div id="dropdownDelay" 
                        className={  `block z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-auto md:w-[28rem] dark:bg-gray-700 absolute max-h-96`}>
                            {filteredOptions.length > 0 ? (
                                <>
                                    <div className='flex px-2 py-2'>
                                        <label htmlFor="simple-search" className="sr-only">Search</label>
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                                                </div>
                                            <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search" onChange={(e) => setSearchQuery(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex px-2 py-2">
                                        <div className="flex flex-wrap items-center justify-center">
                                            <div
                                                className="text-center items-center font-medium text-gray-900 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-800  p-1 border border-white dark:border-gray-700  rounded-lg shadow-sm text-md py-3 px-2 cursor-pointer"
                                                onClick={() => {
                                                    setSelectedDate('')
                                                    setFilteredOptions(options)
                                                }}
                                                >
                                                All
                                            </div>
                                            {filterDate.map((date : string) => {
                                                const regex = /^(\d{1,2})([A-Z]{3})\d*$/;
                                                const match = date.match(regex);
                                                const dayOfMonth =  (match !== null) ? match[1] : ''; 
                                                const month = (match !== null) ? match[2]: '';

                                                
                                                return (
                                                    <div
                                                        key={date}
                                                        className="text-center items-center font-medium text-gray-900  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:text-white p-1 border border-white dark:border-gray-700 rounded-lg shadow-sm text-sm cursor-pointer"
                                                        onClick={() => {
                                                            getOptionsByDate(date)
                                                        }}
                                                    >
                                                        <div className='flex flex-col'>
                                                            {dayOfMonth}
                                                            <span>
                                                            {month}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="flex px-2 py-2">
                                        <div className="flex flex-wrap items-center justify-center w-full">
                                            <select 
                                            onChange={handleStrikePriceChange}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                <option selected>All Strike Price</option>
                                                {filterStrike.map((obj)=> (
                                                    <option>{obj}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>        
                                    <ul className="py-2 text-sm text-gray-700 dark:text-white max-h-48  overflow-y-auto" aria-labelledby="dropdownDelayButton">
                                        {filteredOptions.map((item : any)=>{ 
                                            return ( 
                                                <li key={item.id} onClick={() => selectOption(item.value)}>
                                                    <div className=" px-4 py-2 hover:bg-gray-100  dark:hover:bg-gray-600 dark:hover:text-white">{item.value}</div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </>

                            ) : (
                                <>
                                <div className="flex items-center justify-center w-auto h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                    <div role="status">
                                        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                                
                                </>
                            ) }
                    </div>
                )}
            </div>
        </>
    )
}

export default DropdownLargeFilter
