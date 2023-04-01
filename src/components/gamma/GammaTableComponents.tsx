import moment from 'moment';
import React, { useRef, useState } from 'react'
import ReactTable, { useTable, useExpanded, useGroupBy, useRowSelect, usePagination, useGlobalFilter, useBlockLayout,useAsyncDebounce, useFilters , useSortBy, useResizeColumns}  from 'react-table';
import {FaBitcoin, FaEthereum, FaFileDownload, FaArrowUp, FaArrowDown} from 'react-icons/fa'
import {BsGraphDown, BsGraphUp} from 'react-icons/bs';
import { useDownloadExcel } from 'react-export-table-to-excel';
import { AnimatePresence, motion } from 'framer-motion'

const GammaTableComponents = ({ columns, data, expiry, currency, spotPrice, index } : any) => {
    data.sort((a:any,b:any) => a.strike - b.strike)
    const tableRef = useRef(null);
    const [open, setOpen] = useState(index === 0 ? true : false)
    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'Reporting',
        sheet: 'Reporting'
    })
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({ columns, data });


      return (
        <>
            <div className="flex flex-col">
                <div className="-my-2 overflow-x-auto overflow-y-hidden">
                <div className="py-2 align-middle inline-block w-full sm:px-6 lg:px-1">
                    <div className='flex justify-between items-center bg-white dark:bg-black py-2 px-2'>
                        <div className='w-1/5 text-xs inline-flex items-center gap-2'>{currency === 'btc' ? (<FaBitcoin />) : (<FaEthereum/>)}{currency.toUpperCase()}</div>
                        <div className='w-1/5 text-xs inline-flex gap-2 items-center text-green-500 justify-start'><BsGraphUp/> Calls</div>
                        <div className='w-1/5 font-bold text-sm text-center'>{moment(expiry).format('DD MMM YY').toUpperCase()}</div>
                        <div className='w-1/5 text-xs items-center text-red-500 inline-flex  justify-end gap-2'>
                                Puts <BsGraphDown/> 
                        </div>
                        <div className='w-1/5 text-right text-xs gap-2'>
                            Spot Price: ${spotPrice} 
                            <button className='bg-zinc-100 dark:bg-zinc-900 p-2 rounded-lg ml-2 mr-2' onClick={onDownload}><FaFileDownload/></button>
                            <button className='bg-zinc-100  dark:bg-zinc-900 p-2 rounded-lg' onClick={() => setOpen(!open)}>{open ? (<FaArrowDown />) : (<FaArrowUp/>)}</button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {open ? (
                            <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="shadow overflow-hidden border-b border-gray-200 dark:border-black ">
                                <div className='flex flex-1 w-full relative overflow-auto md:overflow-hidden'>
                                    <table ref={tableRef} {...getTableProps()} className="w-full divide-y table-auto divide-gray-200 dark:divide-black">
                                        <thead className="bg-white dark:bg-zinc-900">
                                            {headerGroups.map((headerGroup, index) => (
                                                <tr {...headerGroup.getHeaderGroupProps()} key={`header-${index}`}>
                                                {headerGroup.headers.map((column) => (
                                                    <th
                                                    {...column.getHeaderProps()}
                                                    key={`header-${index}-${column.id}`}
                                                    className="group px-2 py-3 text-center text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider"
                                                    >
                                                    {column.render('Header')}
                                                    </th>
                                                ))}
                                                </tr>
                                            ))}
                                        </thead>
                                            <tbody {...getTableBodyProps()}  className="bg-white dark:bg-black">
                                            {rows.map((row:any, i) => {
                                                prepareRow(row);
                                
                                                return (
                                                <tr key={`row-${i}`} {...row.getRowProps()} className='dark:even:bg-zinc-900 dark:odd:bg-black even:bg-white odd:bg-gray-100 md:hover:bg-zinc-100 md:dark:hover:bg-stone-800'>
                                                    {row.cells.map((cell : any) => {
                                                        if(cell.column.id === "strike"){
                                                            return (
                                                                <td
                                                                key={`row-${i}-${cell.column.id}`}
                                                                {...cell.getCellProps()}
                                                                className="w-[120px] py-2 bg-papayawhip bg-white dark:bg-black text-xs text-center border-zinc-300"
                                                                >
                                                                {cell.render('Cell')}
                                                                </td>
                                                            );
                                                        } else {
                                                            return (
                                                                <td
                                                                key={`row-${i}-${cell.column.id}`}
                                                                {...cell.getCellProps()}
                                                                className="px-2 py-2 bg-papayawhip text-xs text-center w-[50px]"
                                                                >
                                                                {cell.render('Cell')}
                                                                </td>
                                                            );
                                                        }
                                                    })}
                                                </tr>
                                                );
                                            })}
                                            </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
                </div>
            </div>
        </>

      );
}

export default GammaTableComponents