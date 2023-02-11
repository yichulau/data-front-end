import React, { useState, useEffect, useRef, useContext } from "react";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../../utils/resize';
import MyThemeContext from '../../../store/myThemeContext';

const PositionBuilderCharts = ({data, amount, indexPrice, resetChart} : any) => {
    
    const { isDarkTheme}= useContext(MyThemeContext); 
    const chartRef = useRef<HTMLDivElement>(null);
    const min = Number(-indexPrice*amount*2);
    const max = Number(indexPrice*amount*2);
    let chart: any;

    const clearChart = () =>{
      resetChart()
    }

    useEffect(() => {
      if (!chartRef.current) {
        return;
      }
      chart = isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current);

      const options = {
        darkMode: true,
        backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
        tooltip: {
            show: true,
            trigger: 'axis',
            textStyle: {
                color: '#fff',
                fontSize: 14
            },
            backgroundColor: 'rgba(18, 57, 60, .8)',
            borderColor: "rgba(18, 57, 60, .8)",
            formatter: function (params : any) {
              let str = "";
              for (let i = 0; i < params.length; i++) {
                  if (params[i].seriesName !== "") {
                      str +=  
                          `Index Price Change` +
                          ' : '+
                          params[i].value[0] + ` (%)` +
                          "<br/>" +
                          `Expiry` +
                          ' : '+
                          parseFloat(params[i].value[1]).toFixed(2)  + `` +
                          "<br/>";
                  }
              }
              return  str;
          },
            axisPointer: {
              lineStyle: {
                  color: {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 0,
                      y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(0, 255, 233,0)',
                            },
                            {
                                offset: 0.5,
                                color: 'rgba(255, 255, 255,1)',
                            },
                            {
                                offset: 1,
                                color: 'rgba(0, 255, 233,0)',
                            },
                        ],
                        global: false,
                    },
                },
            },
        },
        grid: {
          top: '10%',
          left: '2%',
          right: '2%',
          bottom: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          data: [0, 20, 40, 60, 80, 100],
          min: -100,
          max: 100,
          axisLabel: {
            formatter: "{value} %"
          },
          name: 'Index Price',
          position: 'bottom',
        },
        yAxis: {
          min: min,
          max: max,
          position: 'right',
          name: 'PnL',
          bottom: 0
        },
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: [0],
            yAxisIndex: [0]
          },
          {
            type: 'slider',
            xAxisIndex: [0],
            yAxisIndex: [0],
            show: false
          }
        ],
        series: [{
          type: 'line',
          smooth: true,
          areaStyle:{},
          data: data,
          showSymbol: false,
          itemStyle: {
            normal:{
              lineStyle:{
                widtth: 2,
                color: 'rgb(126,99,255)'
              }
            }
          },
          
        }],
        visualMap: {
          type: 'piecewise',
          show: false,
          pieces:[
            {
              lte: 0,
              color: 'rgb(224,41,74)'
            },
            {
              gte: 0.1,
              color: 'rgb(46,189,133)'
            }
          ]
        },
      };
  
      chart.setOption(options);
      echartsResize(chart)
      return () => {
        chart.dispose();
      };
    }, [data,isDarkTheme]);
    return (
    <>
        <div className='mt-2 mb-2'>
          <div className="flex flex-wrap justify-between">
            <h2 className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Position Builder</h2>
            <div>
              <button type="button" 
                className="text-gray-900 bg-[#EFF2F5] border focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                onClick={clearChart}
              >
                Reset Chart
              </button>
            </div>
          </div>
            
            <div ref={chartRef}  style={{ width: "100%", height: "450px" }} />
        </div>
    
    </>
  )
}

export default PositionBuilderCharts