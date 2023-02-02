import React, { useEffect,useState, useRef } from 'react'
import * as echarts from 'echarts';
import moment from 'moment';
import { Select, Form } from "antd";  
import { echartsResize } from '../../utils/resize';
import DropdownIndex from '../misc/DropdownIndex';

const StackedLineChart = ( {data } : any) => {

    const chartRef = useRef<HTMLDivElement>(null);
    const { Option } = Select;
    const [filter, setFilter] = useState(0); // 0 for filter by exchange, 1 for filter by currency
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      style: { width: "200px" },
    }; 

    const byExchangeCoin = [
        {id: 0, value: 'By Exchange'},
        {id: 1, value: 'By Coin'}
    ]

    const getDataByExchange = () => {
        // group data by ts and exchangeId, and return the series data and x-axis data 
        const groupedData : any = {};
        const seriesData : any= {};
        const xData: string[] = [];
        data.forEach((item: { ts: string | number; exchangeID: string | number; value: string; }) => {
            if (!groupedData[item.ts]) {
                groupedData[item.ts] = {};
            }
            if (!groupedData[item.ts][item.exchangeID]) {
                groupedData[item.ts][item.exchangeID] = parseFloat(item.value);
            } else {
                groupedData[item.ts][item.exchangeID] += parseFloat(item.value);
            }
        });

        Object.keys(groupedData).forEach(ts => {
            xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
            Object.keys(groupedData[ts]).forEach(exchangeId => {
                if (!seriesData[exchangeId]) {
                    seriesData[exchangeId] = [];
                }
                seriesData[exchangeId].push(groupedData[ts][exchangeId]);
            });
        });

        return [seriesData, xData]; 
    }

    const getDataByCoin = () => {
        // group data by ts and coinCurrencyID, and return the series data and x-axis data 
        const groupedData : any = {};
        const seriesData : any= {};
        const xData: string[] = [];
        data.forEach((item: { ts: string | number; coinCurrencyID: string | number; value: string; }) => {
            if (!groupedData[item.ts]) {
                groupedData[item.ts] = {};
            }
            if (!groupedData[item.ts][item.coinCurrencyID]) {
                groupedData[item.ts][item.coinCurrencyID] = parseFloat(item.value);
            } else {
                groupedData[item.ts][item.coinCurrencyID] += parseFloat(item.value);
            }
        });

        Object.keys(groupedData).forEach(ts => {
            xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
            Object.keys(groupedData[ts]).forEach(coinCurrencyId => {
                if (!seriesData[coinCurrencyId]) {
                    seriesData[coinCurrencyId] = [];
                }
                seriesData[coinCurrencyId].push(groupedData[ts][coinCurrencyId]);
            });
        });

        return [seriesData, xData]; 
    }; 

    useEffect(() => {
        if (!chartRef.current) {
            return;
        }
        const chart = echarts.init(chartRef.current);
        chart.clear(); // clear off any previous plotted chart 

        let seriesData : any= {};
        let xData: string[] = [];
        const end = Math.round((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);
        const start = end - 24 * 60 * 60;

        switch (filter) {
            case 0: 
            seriesData = getDataByExchange()[0];
            xData = getDataByExchange()[1];  
            break; 

            case 1: 
            seriesData = getDataByCoin()[0];
            xData = getDataByCoin()[1];  
            break; 
          
            default: 
              break; 
        }
        // set chart options
        chart.setOption({
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow',
                  label: {
                    show: true
                  }
                }
            },
            toolbox: {
                show: true,
                feature: {
                  mark: { show: true },
                  dataView: { show: true, readOnly: false },
                  saveAsImage: { show: true }
                }
            },
            legend: {
                data: Object.keys(seriesData),
                orient: "horizontal",

            },
            xAxis: {
                data: xData
            },
            yAxis: {
                name: "Open Interest",
                axisLabel:{
                    formatter: function (value: any) {
                        if (value >= 1000000) {
                            value = value / 1000000 + 'M';
                        }
                        return value;
                    }
                  }
            },
            series: Object.keys(seriesData).map(exchangeId => {
                return {
                    name: exchangeId,
                    type: 'line',
                    stack: 'x',
                    areaStyle: {},
                    data: seriesData[exchangeId]
                };
            }),
            dataZoom: [
                {
                    type: 'inside',
                    start: end -30,
                    end: end,
                    xAxisIndex: [0]
                  },
                  {
                    type: 'slider',
                    start: end -30,
                    end: end,
                    xAxisIndex: [0]
                  }
            ],
        });

    echartsResize(chart);
    }, [data, filter]);

    const handleFilterChange = (value: number) => {
        setFilter(value); 
    }; 

  return (
   <>
    <h2 className="ml-2 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Chart Of Options Open Interest</h2>
    <div style={{ textAlign: "left" }}>
        <div className='flex flex-row justify-between mb-6'>
            <div className='flex'>
                <div className='px-2 flex flex-col'>
                    <DropdownIndex 
                        title={`Exchange`}  
                        options={byExchangeCoin}
                        onChange={handleFilterChange}
                   
                    />
                </div>
            </div>
        </div>
        <div>
        
        {/* <Form {...layout}>
            <Form.Item>
                <Select 
                defaultValue={filter} 
                onChange={handleFilterChange}>
                    <Option value={0}>By Exchange</Option>
                    <Option value={1}>By Currency</Option>
                </Select>
            </Form.Item>
        </Form> */}
        </div>
        <div ref={chartRef}  style={{ height: '400px', width:'100%'}}></div>
    </div>
   </>
  )
}

export default StackedLineChart