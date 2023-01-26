import React, { useEffect,useState, useRef } from 'react'
import * as echarts from 'echarts';
import { echartsResize } from '../../utils/resize';
import Dropdown from '../misc/Dropdown';



const BarChart = ({ data }: any) => {

    const chartRef :any = useRef(null);
    // const newData = data.reduce((acc : any, curr : any) => {
    //     acc[curr.exchange] = acc[curr.exchange] || { exchange: curr.exchange, count24h: 0 }
    //     acc[curr.exchange].count24h += curr.count24h
    //     return acc
    // }, {})

    let exchanges: any[] = []
    let values: any[] = []
    data.forEach((item: any) => {
        if(!exchanges.includes(item.exchangeID)){
            exchanges.push(item.exchangeID)
        }
        if(!values[item.exchangeID]){
            values[item.exchangeID] = []
        }
        values[item.exchangeID].push({
            value: item.value,
            name: new Date(item.ts * 1000).toDateString()
        });
    });
    

    useEffect(() => {
        const chartInstance = echarts.init(chartRef.current);

        const xAxisData = Object.keys(data).map((item: any) => item.exchangeID)
        const yAxisData = Object.values(data).map((item : any) => item.value)

        const option = {
            legend: {
                data: exchanges
            },
            xAxis: {
                type: 'time',
                axisLabel: {
                    formatter: function (value: unknown) {
                        return echarts.format.formatTime('MM-dd', value);
                    }
                }
            },
            yAxis: {
                type: 'value'
            },
            series: exchanges.map((exchange) => {
                return {
                    name: exchange,
                    type: 'bar',
                    stack: 'total',
                    data: values[exchange],
                }
            })
        };
        chartInstance.setOption(option);
        echartsResize(chartInstance);
      }, []);
      console.log(data)
  return (
    <>
        <div style={{ textAlign: "center" }}>
  
            <div className='flex flex-row justify-between'>
                <div>
                    <Dropdown />
                </div>
                <div>
                    dsadsa
                </div>  
            </div>
            <h2>Echarts</h2>
            <div ref={chartRef} style={{ height: "400px" }}></div>
        </div>
    </>
  )
}

export default BarChart