import React, { useCallback, useEffect, useMemo, useState } from 'react'
import useFetchData from '../../hooks/useFetchData';
import { contractTraded } from '../../utils/contract-traded-urls';
import ActivityPieChart from '../../components/activity/ActivityPieChart';
import ActivityTable from '../../components/activity/ActivityTable';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import ActivityDataGrid from '../../components/activity/ActivityDataGrid';
import {MdOutlineDragIndicator} from 'react-icons/md';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const WS_URL = 'wss://data-ribbon-collector.com/websocket';

// const WS_URL = 'ws://127.0.0.1:3002';


const RecentTrade = () => {
    const urlsContracts = contractTraded.urls;
    const ResponsiveGridLayout : any = useMemo(() => WidthProvider(Responsive), []);


    const [callContractData, setCallContractData] : any = useState([]);
    const [putContractData, setPutContractData] : any = useState([]);

    const [layouts, setLayout] = useState<any>([
        { i: 'table1', x: 0, y: 0, w: 6, h: 14,minW: 4 ,},
        { i: 'table2', x: 6, y: 0, w: 6, h: 14, minW: 4 , },
    ]);

    const dataSet = useFetchData(urlsContracts)
    const summarizeData = summarizeCount24h(dataSet)


    const { sendJsonMessage, getWebSocket } = useWebSocket(WS_URL, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => console.log('WebSocket connection closed.'),
        shouldReconnect: (closeEvent) => true,
        onMessage: (event: WebSocketEventMap['message']) =>  processMessages(event)
    });

    
    function processMessages(event: { data: string; }){
        const response = JSON.parse(event.data);

        if (response.numLevels) {
            console.log(response.numLevels,"hello")
          } else {
            process(response);
        }
    };

    function process(data: any){
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
            } else if (optionType === 'P') {
                setPutContractData((prevData : any) => [...prevData, {...data.data, 
                    isBlockTrade: 1, 
                    direction: data.data.direction !== undefined ? (data.data.direction).toUpperCase() : data.data.side !== undefined ? (data.data.side).toUpperCase() : 'UNKNOWN' , 
                    price: data.data.price !== undefined ? data.data.price : data.data.orderPrice, 
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity,
                    optionType: optionType,
                }]);
            } else {
                setCallContractData((prevData : any) => [...prevData, {...data.data, 
                    isBlockTrade: 1, 
                    direction: data.data.direction !== undefined ? (data.data.direction).toUpperCase() : data.data.side !== undefined ? (data.data.side).toUpperCase() : 'UNKNOWN' , 
                    price: data.data.price !== undefined ? data.data.price : data.data.orderPrice, 
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity,
                    optionType: "",
                }]);
                setPutContractData((prevData : any) => [...prevData, {...data.data, 
                    isBlockTrade: 1, 
                    direction: data.data.direction !== undefined ? (data.data.direction).toUpperCase() : data.data.side !== undefined ? (data.data.side).toUpperCase() : 'UNKNOWN' , 
                    price: data.data.price !== undefined ? data.data.price : data.data.orderPrice, 
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity,
                    optionType: "",
                }]);

            }
        }

    }


    

    
    function summarizeCount24h(data : any) {
        const result = [];
        const exchanges : any = new Set(data.map((d : any) => d.exchange));
        for (const exchange of exchanges) {
          const count24h = data
            .filter((d : any) => d.exchange === exchange)
            .reduce((sum : any, d: any) => sum + d.count24h, 0);
          result.push({ count24h, exchange });
        }
        return result;
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



    
    



  return (
    <>
    <div className="container py-1 mx-auto">
    
      {/* <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layouts }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
          rowHeight={30}
          margin={[10, 10]}
          isResizable={false}
          isDraggable={true}
          draggableHandle=".drag-handle"
          onLayoutChange={(newLayout: any) => setLayout(newLayout)}

        >
        <div key="table1" className="grid-item" >
            <div className="w-full h-full drag-handle">
                <div className='md:w-full mt-2'>
                    <ActivityTable
                        title={`Option Call (CALL)`}
                        data={callContractData.sort((a: any, b: any) => b.tradeTime - a.tradeTime)}
                    />
                </div>
            </div>
        </div>
        <div key="table2" className="grid-item" >
            <div className="w-full h-full drag-handle">
                <div className='md:w-full mt-2'>
                <ActivityTable
                        title={`Option Call (PUT)`}
                        data={putContractData.sort((a: any, b: any) => b.tradeTime - a.tradeTime)}
                    />
                </div>
            </div>
        </div>

        </ResponsiveGridLayout> */}

        {/* <ActivityPieChart data={summarizeData}/> */}
       <div className="flex flex-wrap w-full px-auto md:px-6">
            <div key="table1" className='flex flex-col w-full md:w-1/2 px-2 mb-4'>
                <ActivityTable 
                title={`Option Call (CALL)`}
                data={callContractData.sort((a:any,b:any) => b.tradeTime - a.tradeTime)}
                />
            </div>
            <div key="table2" className='flex flex-col w-full md:w-1/2 px-2 mb-4'>
                <ActivityTable 
                title={`Option Call (PUT)`}
                data={putContractData.sort((a:any,b:any) => b.tradeTime - a.tradeTime)}
                />
            </div>
        </div>

   
    </div>
    </>
  )
}

export default RecentTrade

