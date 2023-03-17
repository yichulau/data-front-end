import React, { ChangeEvent, useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import useFetchData from '../../hooks/useFetchData';
import { contractTraded } from '../../utils/contract-traded-urls';
import ActivityPieChart from '../../components/activity/ActivityPieChart';
import ActivityTable from '../../components/activity/ActivityTable';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import {MdOutlineDragIndicator} from 'react-icons/md';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';

const WS_URL = 'wss://data-ribbon-collector.com/websocket';

// const WS_URL = 'ws://127.0.0.1:3002';


const RecentTrade = () => {
    const urlsContracts = contractTraded.urls;
    const ResponsiveGridLayout : any = useMemo(() => WidthProvider(Responsive), []);
    const [width, setWidth] = useState<any>(undefined);
    const [callContractData, setCallContractData] : any = useState([]);
    const [putContractData, setPutContractData] : any = useState([]);
    const [isRadio, setIsRadio] = useState(1);
    const dataSet = useFetchData(urlsContracts)
    const summarizeData = summarizeCount24h(dataSet)
    const { sendJsonMessage, getWebSocket } = useWebSocket(WS_URL, {
        onOpen: () => console.log('WebSocket connection opened.'),
        onClose: () => console.log('WebSocket connection closed.'),
        shouldReconnect: (closeEvent) => true,
        onMessage: (event: WebSocketEventMap['message']) =>  processMessages(event)
    });
    const [layouts, setLayout] = useState<any>([
        { i: 'table1', x: 0, y: 1, w: 6, h: 15, minW: 4 },
        { i: 'table2', x: 6, y: 1, w: 6, h: 15, minW: 4 },
        { i: 'table3', x: 0, y: 0, w: 12, h: 10, minW: 4 },
    ]);

    
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
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity !== undefined ? data.data.quantity : data.data.size !== undefined ? data.data.size : undefined,
                    optionType: "",
                }]);
                setPutContractData((prevData : any) => [...prevData, {...data.data, 
                    isBlockTrade: 1, 
                    direction: data.data.direction !== undefined ? (data.data.direction).toUpperCase() : data.data.side !== undefined ? (data.data.side).toUpperCase() : 'UNKNOWN' , 
                    price: data.data.price !== undefined ? data.data.price : data.data.orderPrice, 
                    amount: data.data.amount !== undefined ? data.data.amount : data.data.positionQuantity !== undefined ? data.data.positionQuantity : data.data.quantity !== undefined ? data.data.quantity : data.data.size !== undefined ? data.data.size : undefined,
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
          result.push({ count24h, exchange: exchange.toUpperCase()});
        }
        return result;
    }  

    function handleFilterCoin(selectionVal : number){
        const result = [];
        const exchanges : any = new Set(dataSet.map((d : any) => d.coinCurrency));
        console.log(exchanges)
        console.log(dataSet)
        // eth
        for (const exchange of exchanges) {
          const count24h = dataSet
            .filter((d : any) => d.coinCurrency === exchange)
            .reduce((sum : any, d: any) => sum + d.count24h, 0);
          result.push({ count24h, exchange: exchange.toUpperCase()});
        }
        console.log(result)
        // return result;
    }
    
    
    function onCoinChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        console.log(value)
        setIsRadio(+value);
        handleFilterCoin(+value)
    }

    useLayoutEffect(()=>{
        if (typeof window !== 'undefined') {
          window.onresize = () => {
            setWidth(window.innerWidth);
          }
          setWidth(() => window.innerWidth);
        }
    },[])

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
        {width > 764 ? (
            <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: layouts }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                rowHeight={30}
                margin={[10, 10]}
                isResizable={true}
                isDraggable={true}
                draggableHandle=".drag-handle"
                onLayoutChange={(newLayout: any) => setLayout(newLayout)}
            >
                <div key="table1" className="grid-item">
                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>
                        
                        <div className="overflow-x-auto scrollbar-none md:w-full ">
                            {/* <div className="cursor-grab top-5 right-4 drag-handle absolute "><MdOutlineDragIndicator /></div> */}
                            <ActivityTable
                                title={`Option Call (CALL)`}
                                data={callContractData.sort((a: any, b: any) => b.tradeTime - a.tradeTime)}
                            />
                        </div>
    
                    </div>
                </div>
                <div key="table2" className="grid-item">
                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>  
                        <div className="overflow-x-auto scrollbar-none md:w-full">
                            {/* <div className="cursor-grab top-5 right-4 drag-handle absolute "><MdOutlineDragIndicator /></div> */}
                            <ActivityTable 
                                title={`Option Call (PUT)`}
                                data={putContractData.sort((a:any,b:any) => b.tradeTime - a.tradeTime)}
                            />
                        </div>
                    </div>
                    
                </div>
                <div key="table3" className="grid-item">
                    <div className='drag-handle cursor-grab absolute bg-transparent w-full text-transparent'>.</div>
                    <div className='flex bg-white dark:bg-black rounded-lg shadow-sm w-full h-full'>  
                        <div className="overflow-x-auto scrollbar-none md:w-full">
                            <div className="text-center font-bold text-md md:text-lg dark:text-white px-2 py-2 rounded-lg">
                                Total Contracts Traded For The Past 24 Hours Across Exchanges
                            </div>
{/* 
                            <div className='justify-center text-center flex flex-wrap'>
                                <div className="flex items-center mr-4">
                                    <input 
                                        value='1'
                                        onChange={onCoinChange}
                                        checked={isRadio === 1}
                                        id="red-radio" type="radio" 
                                        name="colored-radio" 
                                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="red-radio" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ALL</label>
                                </div>
                                <div className="flex items-center mr-4">
                                    <input 
                                        value='2'
                                        onChange={onCoinChange}
                                        checked={isRadio === 2}
                                        id="green-radio" 
                                        type="radio"
                                        name="colored-radio" 
                                        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="green-radio" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">BTC</label>
                                </div>
                                <div className="flex items-center mr-4">
                                    <input 
                                        value='3'
                                        onChange={onCoinChange}
                                        checked={isRadio === 3}
                                        id="purple-radio" 
                                        type="radio" 
                                        name="colored-radio" 
                                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <label htmlFor="purple-radio" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">ETH</label>
                                </div>
                            </div> */}
                            <ActivityPieChart data={summarizeData}/> 
                        </div>
                    </div>
                    
                </div>
            </ResponsiveGridLayout>

        ) : null}
        {width <= 764 ? (
            <div className="flex flex-wrap w-full px-auto md:px-6">
                <div key="table3" className='flex flex-col w-full md:w-1/2 px-2 mb-4 bg-white dark:bg-black'>
                    <ActivityPieChart data={summarizeData}/> 
                </div>
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
        ): null}

    
   
        {/* <ActivityPieChart data={summarizeData}/> */}


   
    </div>
    </>
  )
}

export default RecentTrade

