import React, { useMemo, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import ReactTable, { useTable, useExpanded } from 'react-table';


const PositionTable = ({dataSet} : any) => {
    const objToArr :object [] = Object.values(dataSet)
    const data = useMemo(() => objToArr ,[dataSet]);
    const columns = useMemo(
        () => [
            {
                // Build our expander column
                id: 'expander', // Make sure it has an ID
                Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded } : any) => (
                  <span {...getToggleAllRowsExpandedProps()}>
                    {isAllRowsExpanded ? '👇' : '👉'}
                  </span>
                ),
                Cell: ({ row }: any) =>
                  // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
                  // to build the toggle for expanding a row
                  row.canExpand ? (
                    <span
                      {...row.getToggleRowExpandedProps({
                        style: {
                          // We can even use the row.depth property
                          // and paddingLeft to indicate the depth
                          // of the row
                          paddingLeft: `${row.depth * 2}rem`,
                        },
                      })}
                    >
                      {row.isExpanded ? '👇' : '👉'}
                    </span>
                  ) : null,
              },
          {
            Header: 'Instrument',
            accessor: 'instrumentName', // accessor is the "key" in the data
          },
          {
            Header: 'Exchange',
            accessor: 'exchange', // accessor is the "key" in the data
          },
          {
            Header: 'Amount',
            accessor: 'amount',
          },
          { 
            Header: 'Value',
            accessor: 'price'
          },
          { 
            Header: 'Avg Price',
            accessor: 'lastPrice'
          },
          { 
            Header: 'Avg_Price(USD)',
            accessor: 'lastPriceUSD'
          },
          { 
            Header: 'Mark Price',
            accessor: 'markPrice'
          },
          { 
            Header: 'Index Price',
            accessor: 'indexPrice'
          },
          { 
            Header: 'Gamma',
            accessor: 'gamma'
          },
          { 
            Header: 'Vega',
            accessor: 'vega'
          },
          { 
            Header: 'Theta',
            accessor: 'theta'
          },
          { 
            Header: 'Rho',
            accessor: 'rho'
          },
          {
            Header: 'Action',
            accessor: 'action',
            Cell: ({ cell } : any) => {
                return (
                    <button >
                        Remove 
                    </button>
                )
            }
          }
        ],
        []
    )

   
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { hiddenColumns },
      } = useTable(
        {
          columns: columns,
          data,
        },
        useExpanded // Use the useExpanded plugin hook
      )
        console.log(hiddenColumns)
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
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        <th scope="col" className="p-4">
                            <div className="flex items-center">
                                <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                            </div>
                        </th>
                        {headerGroup.headers.map(column => (
                        <th
                            {...column.getHeaderProps()}
                            scope="col"
                            className="px-6 py-3"
                        >
                            {column.render('Header')}
                        </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>

                    {rows.map((row, index) => {
                        prepareRow(row)
                        const { original } : any = row 
                        
                        return (
                                <tr {...row.getRowProps()} key={original.timestamp+uuidv4()} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="w-4 p-4">
                                        <div className="flex items-center">
                                            <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                                            <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
                                        </div>
                                    </td>
                                    {row.cells.map(cell => {
                                        return <td className="px-6 py-4" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                    {/* <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {original.instrumentName}
                                    </th>
                                    <td className="px-6 py-4">
                                        {original.exchange}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.price}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.lastPrice}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.lastPrice * original.indexPrice}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.markPrice}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.indexPrice}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.gamma}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.vega}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.theta}
                                    </td>
                                    <td className="px-6 py-4">
                                        {original.rho}
                                    </td> */}
                                </tr>
                        )
                    })}
                    
                </tbody>
            </table>
        </div>
    </>
  )
}

export default PositionTable