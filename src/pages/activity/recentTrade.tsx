import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Dropdown from '../../components/misc/Dropdown'
import useFetchSingleData from '../../hooks/useFetchSingleData';
import useFetchData from '../../hooks/useFetchData';
import { contractTraded } from '../../utils/contract-traded-urls';
import ActivityPieChart from '../../components/activity/ActivityPieChart';
import ActivityTable from '../../components/activity/ActivityTable';
import RGL, { WidthProvider } from "react-grid-layout";
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import usePolling from '../../hooks/usePolling';
import {
    useQuery,
    useMutation,
    useQueryClient,
  } from 'react-query'
import ActivityDataGrid from '../../components/activity/ActivityDataGrid';

// import dynamic from 'next/dynamic';

// const DynamicActivityDataGrid = dynamic(
//   () => import('../../components/activity/ActivityDataGrid'),
//   { ssr: false }
// );


const WS_URL = 'wss://data-ribbon-collector.com/websocket';

// const WS_URL = 'ws://127.0.0.1:3002';


const RecentTrade = () => {
    const queryClient = useQueryClient()
    const urlsContracts = contractTraded.urls;
    const ResponsiveGridLayout : any = useMemo(() => WidthProvider(RGL), []);

    const [callContractData, setCallContractData] : any = useState([]);
    const [putContractData, setPutContractData] : any = useState([]);

    const { sendJsonMessage, getWebSocket } = useWebSocket(WS_URL, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => console.log('WebSocket connection closed.'),
        shouldReconnect: (closeEvent) => true,
        onMessage: (event: WebSocketEventMap['message']) =>  processMessages(event)
    });

    
    const processMessages = (event: { data: string; }) => {
        const response = JSON.parse(event.data);

        if (response.numLevels) {
            console.log(response.numLevels,"hello")
          } else {
            process(response);
        }
    };

    const process = (data: any)=>{
        console.log(data,"proces")
        if(data.op === "contract"){
            const optionType : string = /-(\w)$/.exec(data.data.instrumentID)?.[1] || "";
            if(optionType === 'C'){
                setCallContractData((prevData : any) => [...prevData, {...data.data, 
                    isBlockTrade: 0, 
                    direction: data.data.direction !== undefined ? (data.data.direction).toUpperCase() : data.data.side !== undefined ? (data.data.side).toUpperCase() : 'UNKNOWN' , 
                    price: data.data.price !== undefined ? data.data.price : data.data.orderPrice, 
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity,
                    optionType: optionType,
                }]);
            } else {
                setPutContractData((prevData : any) => [...prevData, {...data.data, 
                    isBlockTrade: 0, 
                    direction: data.data.direction !== undefined ? (data.data.direction).toUpperCase() : data.data.side !== undefined ? (data.data.side).toUpperCase() : 'UNKNOWN' , 
                    price: data.data.price !== undefined ? data.data.price : data.data.orderPrice, 
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity,
                    optionType: optionType,
                }]);
            }

        }
        if(data.op === "blocktrade"){
            const optionType : string = /-(\w)$/.exec(data.data.instrumentID)?.[1] || "";
            if(optionType === 'C'){
                setCallContractData((prevData : any) => [...prevData, {...data.data, 
                    isBlockTrade: 1, 
                    direction: data.data.direction !== undefined ? (data.data.direction).toUpperCase() : data.data.side !== undefined ? (data.data.side).toUpperCase() : 'UNKNOWN' , 
                    price: data.data.price !== undefined ? data.data.price : data.data.orderPrice, 
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity,
                    optionType: optionType,
                }]);
            } else {
                setPutContractData((prevData : any) => [...prevData, {...data.data, 
                    isBlockTrade: 1, 
                    direction: data.data.direction !== undefined ? (data.data.direction).toUpperCase() : data.data.side !== undefined ? (data.data.side).toUpperCase() : 'UNKNOWN' , 
                    price: data.data.price !== undefined ? data.data.price : data.data.orderPrice, 
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity,
                    optionType: optionType,
                }]);
            }
        }

    }

    useEffect(() => {
        function connect() {
            const subscription = {
              op: 'subscribe',
            };
            sendJsonMessage(subscription);
          }
        
        connect();
        

        const pingInterval = setInterval(() => {
            const subscribeMessage = {
              op: 'ping',
            };
            sendJsonMessage(subscribeMessage);
            
        }, 5000);
        
        return () => clearInterval(pingInterval);


  }, [sendJsonMessage, getWebSocket]);

    // const data = useFetchData(urlsContracts)
    // const summarizeData = summarizeCount24h(data)

    
    // function summarizeCount24h(data : any) {
    //     const result = [];
    //     const exchanges : any = new Set(data.map((d : any) => d.exchange));
    //     for (const exchange of exchanges) {
    //       const count24h = data
    //         .filter((d : any) => d.exchange === exchange)
    //         .reduce((sum : any, d: any) => sum + d.count24h, 0);
    //       result.push({ count24h, exchange });
    //     }
    //     return result;
    //   }  
    // async function fetchTableData(){
    //     const url = `https://data-ribbon-collector.com/api/v1.0/btc/okex/block-trade`;
    //     const response = await fetch(url)
    //     return response.json();
    // }   

    // const { isError, error, isLoading, data, isFetching} = useQuery(
    //     'recentTrade',
    //     fetchTableData,
    //     // {
    //     //     refetchInterval: 10000, // poll every 5 seconds
    //     // }
    // )

    // if (isFetching) {
    //     return (
    //         <>
    //             <div>
    //                 ...Loading
    //             </div>

    //         </>
    //     );
    // }

  return (
    <>
    <div className="container py-1 mx-auto">
        <div className="flex flex-wrap px-1">

            
            
            <div key="table" className='flex flex-col w-full  md:w-1/2 px-6 '>
                <ActivityTable 
                title={`Option Call (CALL)`}
                data={callContractData.sort((a:any,b:any) => b.tradeTime - a.tradeTime)}/>
             
            </div>

            <div className='flex flex-col w-full md:w-1/2 px-6'>
                {/* <ActivityTable data={putContractData.sort((a:any,b:any) => b.tradeTime - a.tradeTime)}/> */}
                <ActivityTable 
                title={`Option Call (PUT)`}
                data={putContractData.sort((a:any,b:any) => b.tradeTime - a.tradeTime)}/>
               {/* <ActivityDataGrid  data={putContractData.sort((a:any,b:any) => b.tradeTime - a.tradeTime)} /> */}
            </div>


 
                
            
        </div>
    </div>  
    </>
  )
}

export default RecentTrade

