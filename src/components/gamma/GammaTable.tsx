import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactTable, { useTable, useExpanded, useGroupBy, useRowSelect, usePagination, useGlobalFilter, useBlockLayout,useAsyncDebounce, useFilters , useSortBy, useResizeColumns}  from 'react-table';
import GammaTableComponents from './GammaTableComponents';
import { v4 as uuidv4 } from 'uuid';
import { NoticeType } from 'antd/es/message/interface';
import { AgGridReact } from 'ag-grid-react';
import '/node_modules/ag-grid-community/styles/ag-grid.css';
import '/node_modules/ag-grid-community/styles/ag-theme-alpine.css';
import { classNames } from '../../utils/Utils';
import moment from 'moment';


const GammaTable = ({ data : dataSet, loading, spotPrice, currency } : any) => {
  const data = useMemo(() => dataSet, []);
  const [datas, setDatas] = useState(data)
  const [expiries, setExpiries] = useState<any>([])
  const columns = useMemo(
    () => [
      { Header: 'Price', 
        accessor: 'callLastPrice',
        Cell: filterZeroPill
      },
      { 
        Header: 'Net', 
        accessor: 'callNet',
        Cell: filterZeroPill
       },
      { 
        Header: 'Bid', 
        accessor: 'callBid',
        Cell: BidPill
      },
      { 
        Header: 'Ask', 
        accessor: 'callAsk',
        Cell: AskPill
      },
      { Header: 'Vol', 
        accessor: 'callVol',
        Cell: filterZeroPill
      },
      { Header: 'IV', 
        accessor: 'callIV',
        Cell: filterZeroPill
      },
      { Header: 'Delta', 
        accessor: 'callDelta',
        Cell: (obj : any) => obj.value.toFixed(2)
      },
      { 
        Header: 'Gamma', 
        accessor: 'callGamma',
        Cell: (obj : any) => obj.value.toFixed(2)
      },
      { 
        Header: 'OI', 
        accessor: 'callOpenInterest',
        Cell: filterZeroPill
      },
      { 
        Header: 'Strike Price', 
        accessor: 'strike',
        Cell: StrikePill
      },
      { 
        Header: 'OI', 
        accessor: 'putOpenInterest',
        Cell: (obj : any) => obj.value.toFixed(2)
      },
      { 
        Header: 'Gamma', 
        accessor: 'putGamma',
        Cell: (obj : any) => obj.value.toFixed(2)
      },
      { 
        Header: 'Delta', 
        accessor: 'putDelta',
        Cell: (obj : any) => obj.value.toFixed(2)
      },
      { 
        Header: 'IV', 
        accessor: 'putIV' ,
        Cell: filterZeroPill
      },
      { 
        Header: 'Vol', 
        accessor: 'putVol',
        Cell: filterZeroPill
      },
      { 
        Header: 'Ask', 
        accessor: 'putAsk',
        Cell: AskPill
      },
      { 
        Header: 'Bid', 
        accessor: 'putBid',
        Cell: BidPill
      },
      { 
        Header: 'Net', 
        accessor: 'putNet',
        Cell: filterZeroPill
      },
      { 
        Header: 'Price', 
        accessor: 'putLastPrice',
        Cell: filterZeroPill
      }     
    ],
    []
  );

  const onChangeOptionChain = (item : any) =>{
    setDatas(data.filter((obj : any)=> obj.includes(item)))
  }

  const renderTable = (data:any, expiry:any, currency: any, index: any) => {
   
    return (
      <div key={expiry+uuidv4()} className='w-full'>
  
        {/* <div className='bg-white flex lg:px-1'>

          <h2 className="text-xl font-semibold my-4">Expiry: {expiry}</h2>
          <h2 className="text-xl font-semibold my-4">Currency: {currency}</h2>
        </div> */}
        <GammaTableComponents columns={columns} data={data} expiry={expiry} currency={currency} spotPrice={spotPrice} index={index} />
      </div>
    );
  };
  console.log(datas)
  useEffect(() => {
    if (dataSet && dataSet.length > 0) {
      const expiries: string[] = dataSet.map((item : any) => item.expiry);
      dataSet.sort((a:any, b:any) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime())
      setExpiries(expiries)
      setDatas(dataSet);
    }
  }, [dataSet]);
  

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className='flex flex-col w-full'>
            {datas.length > 0 ? (
              <>
              <div className="w-full">
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto overflow-y-hidden">
                      <div className="py-2 align-middle inline-block w-full sm:px-6 lg:px-1">
                        <div className='flex justify-between items-center bg-white dark:bg-black py-2 px-2 rounded-t-lg'>
                            <div className='text-left text-sm font-bold'>Option Chain ({currency})</div>

                        </div>
                        {/* <div className='flex items-center bg-white dark:bg-zinc-900 py-2 px-2 gap-2'>
                            {expiries.map((item : string, index: number)=>{
                                 
                                 return (
                                  <button
                                      key={index}
                                      className="text-center items-center font-medium text-gray-900  dark:bg-gray-800 hover:bg-zinc-100 hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:text-white p-1 border border-zinc-200 dark:border-gray-700 rounded-lg shadow-sm text-xs cursor-pointer" 
                                      onClick={() => {
                                          onChangeOptionChain(item)
                                      }}
                                  >
                                      <div className='flex flex-col '>
                                          {moment(item).format('DD MMM YY').toUpperCase()}
                                      </div>
                                  </button>
                              )
                            })}
                            
                        </div> */}
                      </div>
                    </div>
                </div>
              </div>
              {datas.map((expiryData: any, index: any) => {
                return renderTable(expiryData.data, expiryData.expiry, expiryData.currency, index);
              })}
            </>
            ) : null}


        </div>
      )}
    </>
  );
  
}

export default GammaTable


export function StrikePill({ row, value } : any) {
  const values = value

  return (
    <span
      className={classNames(
        "text-center px-2 py-1 uppercase leading-wide text-xs font-bold",
      )}
    >
      {values}
    </span>
  );
}

export function BidPill({ value } : any) {
  return (
    <span
      className={classNames(
        "text-center text-xs text-green-400",
      )}
    >
      {value !== 0 && value !== undefined ? value.toFixed(2) : '--' }
    </span>
  );
}

export function AskPill({ value } : any) {
  return (
    <span
      className={classNames(
        "text-center text-xs text-red-400",
      )}
    >
       {value !== 0 && value !== undefined ? value.toFixed(2) : '--' }
    </span>
  );
}

export function filterZeroPill({ value } : any) {
  return (
    <span
      className={classNames(
        "text-center",
      )}
    >
       {value !== 0 && value !== undefined  ? value.toFixed(2) : '--' }
    </span>
  );
}