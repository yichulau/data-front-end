import React, { useEffect,useState, useRef } from 'react'
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../utils/resize';
import moment from 'moment';
import { exchangeModel } from '../../models/exchangeModel';
import SelectOption from '../misc/SelectOption';

interface Data {
    coinCurrencyID: number;
    exchangeID: number;
    ts: number;
    value: string;
}


const StackedBarChart = ( {data } : any) => {
    console.log(data)
    const chartRef = useRef<HTMLDivElement>(null);

    const handleSelectOption = (event : any) =>{
       const { value } = event.target;
    }

    useEffect(() => {
        if (!chartRef.current) {
            return;
          }
        const chart = echarts.init(chartRef.current);

        // format timestamp to local timezone
        // const dataTimestamp = data.map((item : any)=> {
        //     item.ts = moment.unix(item.ts).format('DD HH:mm');
        //     return item;
        // });

        // group data by ts and exchangeId
        const groupedData : any = {};
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

        // convert grouped data to data array
        const seriesData : any= {};
        const xData: string[] = [];
        const end = Math.round((new Date().getTime() - 24 * 60 * 60 * 1000) / 1000);
        const start = end - 24 * 60 * 60;
        Object.keys(groupedData).forEach(ts => {
            xData.push(moment.unix(Number(ts)).format('DD-MM-yy HH:mm:ss'));
            Object.keys(groupedData[ts]).forEach(exchangeId => {
                if (!seriesData[exchangeId]) {
                    seriesData[exchangeId] = [];
                }
                seriesData[exchangeId].push(groupedData[ts][exchangeId]);
            });
        });

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
                  magicType: { show: true, type: ['line', 'bar'] },
                  saveAsImage: { show: true }
                }
            },
            legend: {
                data: Object.keys(seriesData),
                top: 0,
                left: 50,
                orient: 'horizontal'

            },
            xAxis: {
                data: xData
            },
            yAxis: {},
            series: Object.keys(seriesData).map(exchangeId => {
                return {
                    name: exchangeId,
                    type: 'bar',
                    stack: 'total',
                    data: seriesData[exchangeId]
                };
            }),
            dataZoom: [
                {
                    type: 'slider',
                    start: start,
                    end: end,
                    xAxisIndex: [0],
                },
                {
                    type: 'inside',
                    xAxisIndex: [0],
                }
            ],
        });
    }, [data]);

    

    
  return (
   <>
    <h2 className='text-center'>Chart Of Options Volume</h2>
    <div style={{ textAlign: "center" }}>

        <div className='flex flex-row justify-between'>
            <div>
                <SelectOption handleSelectOption={handleSelectOption} />
            </div>
        </div>
        <div ref={chartRef}  style={{ width: '100%', height: '400px'}}></div>
    </div>
   </>
  )
}

export default StackedBarChart