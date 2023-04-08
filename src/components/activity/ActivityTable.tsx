import React, { useMemo, useRef } from 'react'
import ReactTable, { useTable, useExpanded, useGroupBy, useRowSelect, usePagination, useGlobalFilter, useBlockLayout,useAsyncDebounce, useFilters , useSortBy, useResizeColumns}  from 'react-table';
import { classNames } from '../../utils/Utils';
import { CgChevronDoubleLeft, CgChevronDoubleRight, CgChevronRight, CgChevronLeft } from 'react-icons/cg'
import {FaBitcoin, FaEthereum} from 'react-icons/fa'
import moment from 'moment';
import { exchangeModel } from '../../models/exchangeModel';
import ActivityFilterDropdown from './ActivityFilterDropdown';
import {GiStoneBlock} from "react-icons/gi"
import ActivitySearch from './ActivitySearch';


interface ActivityTable {
    blockTradeID: number,
    coinCurrencyID: number,
    instrumentID: string,
    price: number,
    tradeID: string,
    tradeTime: Date
}
interface ActivityTableProps{
    data: ActivityTable[]
    title: string
}
const ActivityTable : React.FC<ActivityTableProps> = ({data, title} : ActivityTableProps) => {
    const tableRef = useRef(null);
    const dataSet = useMemo(() => data ,[data]);
    const column : any[] = useMemo(
        () => [
            {
              Header: "direction",
              accessor: "direction",
              Cell: DirectionPill,
            },
            {
              Header: "exchange",
              accessor: "exchangeID",
              Cell: ExchangePill
            },
            {
              Header: "instruments",
              accessor: "instrumentID",
              Filter: SelectColumnFilter,  
              filter: 'includes',  
            },

            {
                Header: "coinCurrency",
                accessor: "coinCurrencyID",
                Cell: coinCurrencyPill,
                // Filter: SelectColumnFilter,  
                // filter: 'includes',  
            },
            {
              Header: "optionType",
              accessor: "optionType",
              Cell: optionTypePill
            },
            {
                Header: "price",
                accessor: "price",
            },
            {
              Header: "amount",
              accessor: "amount",
            },
            {
              Header: "trade Time",
              accessor: "tradeTime",
              Cell: tradeTimePill
            }
        ],
        []
    );

    const { getTableProps, 
    getTableBodyProps, 
    headerGroups, 
    rows,
    page, 
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    prepareRow,
    totalColumnsWidth,
    state, 
    preGlobalFilteredRows, 
    setGlobalFilter,   
    getToggleHideAllColumnsProps,
    allColumns
    } = useTable({
        data: dataSet,
        columns: column
    },
        useFilters, 
        useGlobalFilter,
        useSortBy,
        useResizeColumns,
        usePagination, 
    );


    // console.log(data)



  return (
    <>
      <div className="sm:flex sm:gap-x-2 bg-white dark:bg-black sm:rounded-t-lg px-3 pb-3 ">
        <div className='flex flex-col w-full'>
          <div className='w-full py-4 text-left font-bold text-sm text-black dark:text-white '>
            {title}
          </div>
          <div className='flex justify-between'>
              <ActivitySearch
                preGlobalFilteredRows={preGlobalFilteredRows}
                globalFilter={state.globalFilter}
                setGlobalFilter={setGlobalFilter}
              />
              <ActivityFilterDropdown allColumns={allColumns} getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}/>
              {/* {headerGroups.map((headerGroup) =>
                headerGroup.headers.map((column) =>
                  column.Filter ? (
                    <div className="mt-2 sm:mt-0" key={column.id}>
                      {column.render("Filter")}
                    </div>
                  ) : null
                )
              )} */}
          </div>
        </div>

     
      </div>
      {/* table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 dark:border-black ">
              <div className='flex flex-1 w-full relative'>
                <div className='w-full min-h-[400px]  bg-white dark:bg-black overflow-auto scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800 scrollbar-track-white dark:scrollbar-track-zinc-600'>
                  <table {...getTableProps()} className="w-full  divide-y table-auto divide-gray-200 dark:divide-black">
                    <thead className="bg-gray-50 dark:bg-zinc-900">
                      {headerGroups.map((headerGroup, index ) => (
                        <tr {...headerGroup.getHeaderGroupProps()} key={`header-${index}`}>
                          {headerGroup.headers.map(column => (
                            // Add the sorting props to control sorting.
                            <th
                              scope="col"
                              className="group px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                              {...column.getHeaderProps(column.getSortByToggleProps())}
                              key={`header-${index}-${column.id}`}
                            >
                              <div className="flex items-center justify-between">
                                {column.render('Header')}
                                {/* Add a sort direction indicator */}
                                <span>
                                  {column.isSorted
                                    ? column.isSortedDesc
                                      ? <SortDownIcon className="w-4 h-4 text-gray-400" />
                                      : <SortUpIcon className="w-4 h-4 text-gray-400" />
                                    : (
                                      <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                    )}
                                </span>
                              </div>
                             
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody
                      {...getTableBodyProps()}
                      className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-600 "
                    >

                      {page.map((row : any, i) => {  
                        prepareRow(row)
                        const direction  = row.original.direction

                        return (
                          <tr   key={`row-${i}`} {...row.getRowProps()} className='dark:even:bg-zinc-900 dark:odd:bg-black even:bg-white odd:bg-gray-100 md:hover:bg-zinc-100 md:dark:hover:bg-stone-800 font-bold'>
                            {row.cells.map((cell:any) => {
                              return (
                                <td
                                  {...cell.getCellProps()}
                                  className={classNames(
                                    "px-3 py-1 whitespace-nowrap font-bold ",
                                    direction === "BUY" ? " text-green-700 " : null,
                                    direction === "SELL" ? " text-red-700" : null,
                                  )}
                                  role="cell"
                                  key={`row-${i}-${cell.column.id}`}
                                >
                                  {cell.column.Cell.name === "defaultRenderer"
                                    ? <div 
                                      className={classNames(
                                        "text-sm font-bold",
                                        direction === "BUY" ? "text-green-700" : null,
                                        direction === "SELL" ? "text-red-700" : null,
                                      )}
                                    >{cell.render('Cell')}</div>
                                    : cell.render('Cell')
                                  }
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}

                    </tbody>
                  </table>
                </div>
                {/* <div className="w-[50px] px-4 py-8 right-0 flex-col justify-center items-center bg-gray-50 dark:bg-black">
                  <div className="flex items-center mb-4 whitespace-nowrap transform rotate-90 font-medium">
                    
                    Columns
                    <FaBitcoin/>
                  </div>
                 
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="py-3 px-3 flex items-center justify-between bg-white dark:bg-black sm:rounded-b-lg">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div className="flex gap-x-2 items-baseline">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{state.pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>
            </span>
            <label>
              <span className="sr-only">Items Per Page</span>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-black dark:border-gray-900"
                value={state.pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value))
                }}
              >
                {[5, 10, 20].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px " aria-label="Pagination">
              <PageButton
                className="rounded-l-md "
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <span className="sr-only ">First</span>
                <CgChevronDoubleLeft className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="dark:bg-black dark:border-gray-900"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                <span className="sr-only">Previous</span>
                <CgChevronLeft className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="dark:bg-black dark:border-gray-900"
                onClick={() => nextPage()}
                disabled={!canNextPage
                }>
                <span className="sr-only">Next</span>
                <CgChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
              <PageButton
                className="rounded-r-md dark:bg-black dark:border-gray-900"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                <span className="sr-only">Last</span>
                <CgChevronDoubleRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </PageButton>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default ActivityTable


export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render  },
}: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
      <label className="flex gap-x-2 items-baseline">
        {/* <span className="text-gray-700">{render("Header")}: </span> */}
        <select
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          name={id}
          id={id}
          value={filterValue}
          onChange={e => {
            setFilter(e.target.value || undefined)
          }}
        >
          <option value="">{render("Header")}</option>
          {options.map((option : any, i) => (
            <option key={i} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
  );
}

export function Button({ children, className, ...rest }: any) {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white hover:bg-gray-50 dark:bg-black dark:border-gray-700",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PageButton({ children, className, ...rest }: any) {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 dark:text-white hover:bg-gray-50 dark:bg-black dark:border-gray-700",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function SortIcon({ className }:any) {
  return (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z"></path></svg>
  )
}

export function SortUpIcon({ className }:any) {
  return (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z"></path></svg>
  )
}

export function SortDownIcon({ className }:any) {
  return (
    <svg className={className} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 320 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z"></path></svg>
  )
}


export function StatusPill({ value } : any) {
  const status = value ? value.toUpperCase() : "unknown";

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-xs rounded-lg shadow-sm",
        status === 'BUY' ? "bg-green-100 text-green-700" : null,
        status === 'SELL' ? "bg-red-100 text-red-700" : null,
      )}
    >
      {status}
    </span>
  );
}


export function coinCurrencyPill({ value } : any) {
  const status = value ? value: "unknown";

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-sm text-center flex gap-2 items-center",
      )}
    >
      {status === 1 ? (
      <>
        <FaBitcoin/> BTC

      
      </>) : (<><FaEthereum/> ETH</>)}
    </span>
  );
}


export function tradeTimePill({ value } : any) {
  const timestamp = value; // timestamp in seconds
  const date = moment.unix(timestamp);
  const formattedDate = date.format('DD MMM YYYY, HH:mm:ss');

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide font-bold text-sm ",

      )}
    >
      {formattedDate}
    </span>
  );
}

export function ExchangePill({ value } : any) {
  const values = value !== undefined ? value : 'unknown'

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide text-sm font-bold whitespace-nowrap ",

      )}
    >
      {exchangeModel.getDataByExchange(values)}
    </span>
  );
}

export function DirectionPill({ row, value } : any) {
  const isBlockTrade = row.original.isBlockTrade === 1 ? true: false;
  const values = value !== undefined ? value : 'UNKNOWN'

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide text-sm font-bold flex gap-2",

      )}
    >
        {isBlockTrade && (<GiStoneBlock/>)}{values}
    </span>
  );
}

export function optionTypePill({ row, value } : any) {
  const values = value === 'C' ? 'CALL' : 'PUT'

  return (
    <span
      className={classNames(
        "px-3 py-1 uppercase leading-wide text-sm font-bold flex gap-2",

      )}
    >
      {values}
    </span>
  );
}

