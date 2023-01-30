import React, { useState} from 'react'

const SelectOption = ({handleSelectOption} : any) => {
    const [option, setOption] = useState('');

  return (
    <>
        <select id="countries" 
            onChange={handleSelectOption}
        className="w-24 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            <option value={'notional'}>Notional</option>
            <option value={'premium'}>Premium</option>
        </select>
    </>
  )
}

export default SelectOption