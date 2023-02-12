import React, { useEffect, useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import ReactTable, { useTable, useExpanded, useGroupBy,} from 'react-table';


const PositionTable = ({columns, data} : any) => {
    

    const {
        getTableProps,
        getTableBodyProps,
        toggleAllRowsExpanded,
        isAllRowsExpanded,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded },
      } = useTable(
        {
          columns: columns,
          data,
        },
         useExpanded,  
        )

        
    // useMemo(()=>{
    //     toggleAllRowsExpanded(true); 
    // },[toggleAllRowsExpanded])


  return (
    <> 
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex items-center justify-between pb-4">

                <label htmlFor="table-search" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-   400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                    </div>
                    <input type="text" id="table-search" className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items"/>
                </div>
            </div>
            <table {...getTableProps()} className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-white dark:bg-black dark:text-white">
                {headerGroups.map((headerGroup, index )=> (
                   <></>
                    )
                    )}
                </thead>
                <tbody {...getTableBodyProps()}>

                    {rows.map((row, index) => {
                        prepareRow(row)
                        const { original } : any = row 
                        
                        return (
                            <></>
                        )
                    })}
                    
                </tbody>
            </table>
        </div>
    </>
  )
}

export default PositionTable