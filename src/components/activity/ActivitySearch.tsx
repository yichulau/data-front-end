
import React, { useMemo, useRef,useState } from 'react'
import ReactTable, { useTable, useExpanded, useGroupBy, useRowSelect, usePagination, useGlobalFilter, useBlockLayout,useAsyncDebounce}  from 'react-table';


export default function ActivitySearch({
    preGlobalFilteredRows,
    globalFilter,
    setGlobalFilter,
  }: any) {
    const count = preGlobalFilteredRows.length
    const [value, setValue] = useState(globalFilter)
    const onChange = useAsyncDebounce((value:any) => {
      setGlobalFilter(value || undefined)
    }, 200)
  
    return (
        <label className="flex gap-x-2 items-baseline relative ">
          <div className="absolute top-0 inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-stone-900 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            value={value || ""}
            onChange={e => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
            placeholder={`Search: `}
          />
        </label>
      )
  }