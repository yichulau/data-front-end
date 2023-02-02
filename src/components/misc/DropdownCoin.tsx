import React, { useState, useRef, useEffect } from 'react'
import listenForOutsideClicks from '../../utils/listen-for-outside-clicks';

const DropdownCoin = ({title , options, onChange} : any) => {
    const [selectedOption, setSelectedOption] = useState('BTC');
    const [isOpen, setIsOpen] = useState(false)
  

    const toggleOptions = () => {
        setIsOpen(!isOpen);
    };
    const menuRef = useRef(null)
    const [listening, setListening] = useState(false)
    const selectOption = (option: any , optionValue: string) => {
        setSelectedOption(optionValue);
        setIsOpen(false);
        onChange(option)
    };

    useEffect(listenForOutsideClicks(listening, setListening, menuRef, setIsOpen))

    return (
        <>
           
            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"> {title}</label>
            <div ref={menuRef}>
                <button 
                    onClick={toggleOptions}
                    className="text-[#58667E] bg-[#EFF2F5] hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-800" type="button">{selectedOption}<svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>
                {isOpen && (
                    <div id="dropdownDelay" className={  `block z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute max-h-48 overflow-y-auto`}>
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 max-h-48`" aria-labelledby="dropdownDelayButton">
                            {options.map((item : any)=>{ 
                                return ( 
                                <li key={item.id} onClick={() => selectOption(item.id, item.value)}>
                                    <div className=" px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item.value}</div>
                                </li>)
                            })}
                        </ul>
                    </div>
            )}
            </div>
        </>
  )
}

export default DropdownCoin