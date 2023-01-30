 import React, { useState } from 'react'

const Dropdown = ({title , options} : any) => {
    const [dropdown, setDropdown] = useState(false);

  return (
    <>
        <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{title}</label>
            
        <button 
             onClick={() => setDropdown(!dropdown)}
        
        id="dropdownDelayButton" data-dropdown-toggle="dropdownDelay" data-dropdown-delay="500" data-dropdown-trigger="hover" className="text-[#58667E] bg-[#EFF2F5] hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">All<svg className="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg></button>

        {/* <div id="dropdownDelay" className={dropdown ? `block` : `hidden` + `z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute`}>
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDelayButton">
                {options.map((item : any)=>{ 
                    <li key={item.id}>
                        <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{item.value}</a>
                    </li>
                })}
            </ul>
        </div> */}
    </>
  )
}

export default Dropdown