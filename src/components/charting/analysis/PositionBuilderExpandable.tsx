import React, { useMemo } from 'react'
import moment from 'moment';
import PositionTable from './PositionTable';
import { FaTrashAlt} from 'react-icons/fa';

const PositionBuilderExpandable = ({dataSet, onDelete, handleCheckBoxChanges} : any) => {
    const objToArr :object [] = Object.values(dataSet)
    const data = useMemo(() => objToArr ,[dataSet]);
    const columns = useMemo(
        () => [
            // {
            //     // Build our expander column
            //     id: 'expander', // Make sure it has an ID
            //     Cell: ({ row }: any) =>
            //       // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
            //       // to build the toggle for expanding a row
            //       row.canExpand ? (
            //         <span
            //           {...row.getToggleRowExpandedProps({
            //             style: {
            //               // We can even use the row.depth property
            //               // and paddingLeft to indicate the depth
            //               // of the row
            //               paddingLeft: `${row.depth * 2}rem`,
            //             },
            //           })}
            //         >
            //           {row.isExpanded ? '👇' : '👉'}
            //         </span>
            //       ) : null,
            //   },
            // {
            //     Header: 'Time',
            //     accessor:'date'
            // },
          {
            Header: 'Instrument',
            accessor: 'instrumentName', // accessor is the "key" in the data

          },
          {
            Header: 'Exchange',
            accessor: 'exchange', // accessor is the "key" in the data

          },
          {
            Header: 'Position',
            accessor: 'position', // accessor is the "key" in the data
            Cell: (row : any) => {
                const {cell} = row

                return (
                    <span 
                        style={{
                            backgroundColor: cell.value === 'Long' ? '#00A8A0' : '#FC5328',
                            color: '#ffffff',
                            padding: '4px 10px 4px 10px',
                            borderRadius: '5px'
                        }}
                        key={row.data.id}  
                    >
                    {cell.value}
                    </span>
                )
            } 
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
            Header: 'AvgPrice',
            accessor: 'lastPrice'
          },
          { 
            Header: 'Avg_Price(USD)',
            accessor: 'lastPriceUSD',
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
            Cell: (row : any) => {
                return (
                    <div>
                        <button onClick={e=> handleBtnClick(row.row.original)}><FaTrashAlt /></button>
                    </div>
                )
            }
          }
        ],
        []
    )

    const dataset = data.map((entry : any) => ({
        date: moment(entry.timestamp).format('DDMMMYY'),
        instrumentName: '',
        underlyingName: '',
        indexPrice: '',
        markPrice: '',
        vega: '',
        theta:'',
        rho: '',
        gamma: '',
        delta: '',
        underlyingPrice:'',
        price: '',
        lastPrice: '',
        high24h: '',
        low24h:'' ,
        priceChange24h: '',
        volume24h: '',
        openInterest: '',
        markIv: '',
        amount: '',
        exchange: '',
        position: '',
        subRows: [
          {
            instrumentName: entry.instrumentName,
            underlyingName: entry.underlyingName,
            indexPrice: entry.indexPrice,
            markPrice: entry.markPrice,
            vega: entry.vega,
            theta:entry.theta,
            rho: entry.rho,
            gamma: entry.gamma,
            delta: entry.delta,
            underlyingPrice:entry.underlyingPrice,
            price: entry.price,
            lastPrice: entry.lastPrice,
            high24h: entry.high24h,
            low24h:entry.low24h ,
            priceChange24h: entry.priceChange24h,
            volume24h: entry.volume24h,
            openInterest: entry.openInterest,
            markIv: entry.markIv,
            amount: entry.amount,
            exchange: entry.exchange,
            position: entry.position,
          },
        ],
    }));

    const mergedDataset = dataset.reduce((acc : any, entry : any) => {
        const dateExists = acc.find((e : any) => e.date === entry.date);
        if (dateExists) {
          dateExists.subRows = [...dateExists.subRows, ...entry.subRows];
        } else {
          acc.push({ 
            date: entry.date, 
            instrumentName: entry.instrumentName,
            underlyingName: entry.underlyingName,
            indexPrice: entry.indexPrice,
            markPrice: entry.markPrice,
            vega: entry.vega,
            theta:entry.theta,
            rho: entry.rho,
            gamma: entry.gamma,
            delta: entry.delta,
            underlyingPrice:entry.underlyingPrice,
            price: entry.price,
            lastPrice: entry.lastPrice,
            high24h: entry.high24h,
            low24h:entry.low24h ,
            priceChange24h: entry.priceChange24h,
            volume24h: entry.volume24h,
            openInterest: entry.openInterest,
            markIv: entry.markIv,
            amount: entry.amount,
            exchange: entry.exchange,
            position: entry.position,
            subRows: entry.subRows });
        }
        return acc;
    }, []);

    function handleBtnClick(value : any){
       onDelete(value)
    }

    function handleCheckBoxChange(value : any){
      handleCheckBoxChanges(value) // to the function in position builder
    }
            

  return (
    <>
        {objToArr ? (<PositionTable columns={columns}  data={data} handleCheckBoxChange={handleCheckBoxChange}/>) : null }
    </>
   
  )
}

export default PositionBuilderExpandable