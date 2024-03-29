import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import ReactTable, { useTable, useExpanded, useGroupBy, useRowSelect, usePagination, useGlobalFilter, useBlockLayout}  from 'react-table';
import { useSticky } from 'react-table-sticky'
import IndeterminateCheckbox from './IndeterminateCheckbox';
import { useDownloadExcel } from 'react-export-table-to-excel';
import FilterDropdown from '../../misc/FilterDropdown';


const PositionTable = ({columns, data, handleCheckBoxChange} : any) => {

    const tableRef = useRef(null);

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'Reporting',
        sheet: 'Reporting'
    })

 

    const initialState = {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [],
        selectedRowIds: data.length > 0 ? data.map((d: any) => d.id) : {},
      };

    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        selectedFlatRows,
        toggleAllRowsExpanded,
        rows,
        setGlobalFilter,
        allColumns,
        getToggleHideAllColumnsProps,
        state: { expanded, pageIndex, selectedRowIds, globalFilter },
      } = useTable(
        {
          columns: columns,
          data,
          initialState
        },
         useSticky,
         useGlobalFilter,
         useExpanded,  
         usePagination,
         useRowSelect,
         (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                  id: "anyThing",
                  Header: ({ toggleRowSelected, isAllPageRowsSelected, page }) => {
                    const modifiedOnChange = (event : any) => {
                      page.forEach((row : any) => {
                        //check each row if it is not disabled
                        !row.original.disabled &&
                          toggleRowSelected(row.id, event.currentTarget.checked);
                      });
                    };
        
                    //Count number of selectable and selected rows in the current page
                    //to determine the state of select all checkbox
                    let selectableRowsInCurrentPage = 0;
                    let selectedRowsInCurrentPage = 0;
                    page.forEach((row : any) => {
                      row.isSelected && selectedRowsInCurrentPage++;
                      !row.original.disabled && selectableRowsInCurrentPage++;
                    });
        
                    //If there are no selectable rows in the current page
                    //select all checkbox will be disabled -> see page 2
                    const disabled = selectableRowsInCurrentPage === 0;
                    const checked =
                      (isAllPageRowsSelected ||
                        selectableRowsInCurrentPage === selectedRowsInCurrentPage) &&
                      !disabled;
        
                    return (
                      <div>
                        <IndeterminateCheckbox
                          onChange={modifiedOnChange}
                          checked={checked}
                          disabled={disabled}
                        />
                      </div>
                    );
                  },
                  Cell: ({ row } : any) => (
                    <div>
                      <IndeterminateCheckbox
                        {...row.getToggleRowSelectedProps()}
                        disabled={row.original.disabled}
                      />
                    </div>
                  )
                },
                ...columns
              ]);
         }
        )

 


    useEffect(()=>{
        handleCheckBoxChange(
            {
              selectedRowIds: selectedRowIds,
              "selectedFlatRowsOriginal": selectedFlatRows.map(
                (d) => d.original
              )
            },
            null,
            2
          )
    }, [selectedRowIds])
        
    useMemo(()=>{
        toggleAllRowsExpanded(true); 
    },[toggleAllRowsExpanded])


  return (
    <> 
        {/* <div>
            <div>

            </div>
            {
                allColumns.map(column => (
                    <div key={column.id}>
                        <label>
                            <input type='checkbox' {...column.getToggleHiddenProps()} />
                            {column.Header}
                        </label>
                    </div>
                ))
            }
        </div> */}

      <div className="relative overflow-hidden bg-white  dark:bg-black sm:rounded-lg  w-full">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
              <div className="flex items-center flex-1 space-x-4">
                <h5>
                    {/* <span className="text-gray-500">All Products:</span> */}
                    <span className="font-bold dark:text-white">Calculation Portfolio</span>
                </h5>
              </div>

          </div>
          <div className="">
            <div className='flex flex-col md:flex-row px-4 w-full mb-4 p-2'>
                <div className='flex w-full mb-2 md:mb-auto'>
                    <form className="flex items-center w-full md:w-2/5">
                        <label  className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input type="text" id="simple-search"
                                value={globalFilter || ""}   
                                onChange={(e :any) => setGlobalFilter(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-900 dark:border-gray-800 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" 
                            />
                        </div>
                    </form>
                </div>
                <div className="flex flex-col flex-shrink-0 space-y-3 md:flex-row md:items-center lg:justify-end md:space-y-0 md:space-x-3">

                    <FilterDropdown allColumns={allColumns} getToggleHideAllColumnsProps={getToggleHideAllColumnsProps} />
                    <button type="button" 
                        onClick={onDownload}
                    className="flex items-center justify-center flex-shrink-0 px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800 dark:hover:text-white dark:hover:bg-gray-700">
                        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Export
                    </button>
                </div>

            </div>
            <div className='px-2 md: px-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-white dark:scrollbar-track-zinc-600 pb-4 scrollbar-rounded-lg'
            >
                <table ref={tableRef}  {...getTableProps()} className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-stone-900 dark:text-gray-400 sticky top-0">
                        {headerGroups.map((headerGroup, index )=> (
                            <>
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <>
                                            <th scope="col" className="px-4 py-3">
                                                {column.render('Header')}
                                            </th>
                                        </>
                                    ))}
                                </tr>
                            </>
                        )
                        )}
                    </thead>
                  <tbody {...getTableBodyProps()}>
                        {page.map((row, index) => {
                            prepareRow(row)
                            const { original } : any = row 
                          
                            return (
                                <>
                                    <tr {...row.getRowProps()} className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                                        {row.cells.map((cell, cellIndex)  => {
                                            return (
                                                <>
                                                        <td
                                                            {...cell.getCellProps()}
                                                            className={`px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white
                                                            }`}
                                                            style={{ zIndex: 1 }}
                                                        >
                                                            {cell.render("Cell")}
                                                        </td>
                                                    {/* <td {...cell.getCellProps()}className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center" ></td> */}
                                                </>
                                            )
                                        })}
                                    
                                    </tr>
                                </>

                            )
                        })}
                  </tbody>
                </table>
            </div>
              
          </div>
          <nav className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0" aria-label="Table navigation">
                {/* <div className="py-3 flex items-center text-center justify-center pt-10">
                    <div className="flex-1 flex justify-between md:hidden">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</button>
                    <button onClick={() => nextPage()} disabled={!canNextPage}>Next</button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between" aria-label="Pagination">
                        <div className="relative z-0 inline-flex items-center ml-auto mr-auto rounded-md shadow-sm space-x-10" aria-label="Pagination">
                                {paginationRange?.map((pageNumber, index) => {
                                    if (pageNumber === DOTS) {
                                        return (
                                            <div
                                            key={index}>...</div>
                                        );
                                    }

                                    if ((pageNumber - 1) === pageIndex) {
                                        return (
                                            <div
                                                key={index}
                                                className=' active:bg-gray-500 active:border-gray-300'
                                                onClick={() => gotoPage(pageNumber - 1)}>{pageNumber}</div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className='active:bg-gray-500 active:border-gray-300'
                                            onClick={() => gotoPage(pageNumber - 1)}>{pageNumber}</div>
                                    );
                                })}
                        </div>
                    </div>
                </div> */}
   
              {/* <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Showing
                  <span className="font-semibold text-gray-900 dark:text-white">1-10</span>
                  of
                  <span className="font-semibold text-gray-900 dark:text-white">1000</span>
              </span>
              <ul className="inline-flex items-stretch -space-x-px">
                  <li>
                      <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          <span className="sr-only">Previous</span>
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                      </a>
                  </li>
                  <li>
                      <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">1</a>
                  </li>
                  <li>
                      <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">2</a>
                  </li>
                  <li>
                      <a href="#" aria-current="page" className="z-10 flex items-center justify-center px-3 py-2 text-sm leading-tight border text-primary-600 bg-primary-50 border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">3</a>
                  </li>
                  <li>
                      <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                  </li>
                  <li>
                      <a href="#" className="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">100</a>
                  </li>
                  <li>
                      <a href="#" className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                          <span className="sr-only">Next</span>
                          <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                      </a>
                  </li>
              </ul> */}
          </nav>
      </div>


     
     
    </>
  )
}

export default PositionTable


