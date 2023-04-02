import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactTable, { useTable, useExpanded, useGroupBy, useRowSelect, usePagination, useGlobalFilter, useBlockLayout,useAsyncDebounce, useFilters , useSortBy, useResizeColumns}  from 'react-table';
import GammaTableComponents from './GammaTableComponents';
import { v4 as uuidv4 } from 'uuid';
import { classNames } from '../../utils/Utils';
import moment from 'moment';


const GammaTable = ({ data : dataSet, loading, spotPrice, currency, width } : any) => {
  const data = useMemo(() => dataSet, []);
  const [datas, setDatas] = useState(data)
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
  // const columnsMobile = useMemo(
  //   () => [
  //     { 
  //       Header: 'Strike Price', 
  //       accessor: 'strike',
  //       Cell: StrikePill
  //     },  
  //     { 
  //       Header: 'Option Type', 
  //       accessor: 'callOrPut',
  //     },  
  //     { Header: 'Price', 
  //       accessor: 'lastprice',
  //       Cell: filterZeroPill
  //     },
  //     { 
  //       Header: 'Net', 
  //       accessor: 'net',
  //       Cell: filterZeroPill
  //      },
  //     { 
  //       Header: 'Bid', 
  //       accessor: 'bid',
  //       Cell: BidPill
  //     },
  //     { 
  //       Header: 'Ask', 
  //       accessor: 'ask',
  //       Cell: AskPill
  //     },
  //     { Header: 'Vol', 
  //       accessor: 'vol',
  //       Cell: filterZeroPill
  //     },
  //     { Header: 'IV', 
  //       accessor: 'iv',
  //       Cell: filterZeroPill
  //     },
  //     { Header: 'Delta', 
  //       accessor: 'delta',
  //     },
  //     { 
  //       Header: 'Gamma', 
  //       accessor: 'gamma',
  //     },
  //     { 
  //       Header: 'OI', 
  //       accessor: 'openInterest',
  //       Cell: filterZeroPill
  //     },   
  //   ],
  //   []
  // );


  // const filterOptionsData = (data : any, expiry: any) =>{
  //   const callMobileData  :any= [];
  //   const putMobileData :any = [];

  //   data.map((obj : any) => {
  //       Object.entries(obj).forEach(([key, value] : any) => {
  //         if (key.toLowerCase().startsWith("call")) {
  //           callMobileData.push({
  //             strike: obj.strike,
  //             lastprice:obj.callLastPrice,
  //             net: obj.callNet,
  //             bid: obj.callBid,
  //             ask: obj.callAsk,
  //             vol: obj.callVol,
  //             iv: obj.callIV,
  //             delta: obj.callDelta,
  //             gamma: obj.callGamma,
  //             openInterest: obj.callOpenInterest,
  //             expiry: expiry,
  //             callOrPut: 'Call'
  //           });
  //         } else if (key.toLowerCase().startsWith("put")) {
  //           putMobileData.push({
  //             strike: obj.strike,
  //             lastprice:obj.putLastPrice,
  //             net: obj.putNet,
  //             bid: obj.putBid,
  //             ask: obj.putAsk,
  //             vol: obj.putVol,
  //             iv: obj.putIV,
  //             delta: obj.putDelta,
  //             gamma: obj.putGamma,
  //             openInterest: obj.putOpenInterest,
  //             expiry: expiry,
  //             callOrPut: 'Put'
  //           });
  //         }
  //       });


  //   });
  
  //   return { callMobileData, putMobileData };
  // };

  // const onChangeOptionChain = (item : any) =>{
  //   setDatas(data.filter((obj : any)=> obj.includes(item)))
  // }

  const renderTable = (data:any, expiry:any, currency: any, index: any) => {
    // const { callMobileData, putMobileData } = filterOptionsData(data, expiry)
    // const mobileDataSet = [...new Set(callMobileData), ... new Set(putMobileData)]

    return (
      <div key={expiry+uuidv4()} className='w-full'>
        <GammaTableComponents columns={columns} data={data} expiry={expiry} currency={currency} spotPrice={spotPrice} index={index} width={width} />
      </div>
    );
  };

  useEffect(() => {
    if (dataSet && dataSet.length > 0) {
      dataSet.sort((a:any, b:any) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime())
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
                        {/* {width <= 764 ? (
                          <div className='flex items-center bg-white dark:bg-zinc-900 py-2 px-2 gap-2'>
                                    <button
                                        className="text-center items-center font-medium text-gray-900  dark:bg-gray-800 hover:bg-zinc-100 hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 dark:text-white p-1 border border-zinc-200 dark:border-gray-700 rounded-lg shadow-sm text-xs cursor-pointer" 
                                        onClick={() => {
                                            onChangeOptionChain('dsdsd')
                                        }}
                                    >
                                        <div className='flex flex-col '>
                                            All
                                        </div>
                                    </button>
                            
                              
                          </div> 
                        ) : null} */}
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