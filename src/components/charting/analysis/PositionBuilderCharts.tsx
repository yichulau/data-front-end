import React, { useState, useEffect, useRef, useContext } from "react";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../../utils/resize';
import MyThemeContext from '../../../store/myThemeContext';
import abbreviateNumber from "../../../utils/numberFormatter";
import { FaCalendarPlus,FaCalendarMinus } from 'react-icons/fa';
import moment from "moment";

const PositionBuilderCharts = ({data, amount, indexPrice, resetChart} : any) => {
    
    const { isDarkTheme}= useContext(MyThemeContext); 
    const chartRef = useRef<HTMLDivElement>(null);
    const min = Number(-indexPrice*amount*2);
    const max = Number(indexPrice*amount*2);
    const currentDate = moment(new Date()).format('DD-MM-YYYY')
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
                          `Expiry PnL` +
                          ' : $'+
                          parseFloat(params[i].value[1]).toFixed(2)  + ` (USD)` +
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
          top: '6%',
          left: '2%',
          right: '2%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          data: [0, 20, 40, 60, 80, 100],
          min: -100,
          max: 100,
          axisLabel: {
            formatter: "{value} %",
            textStyle: {
              color: isDarkTheme  ? '#ffffff' : '#000000'   ,
            }
          },
          name: 'Index Price',
          position: 'bottom',
          nameLocation: 'middle',
          nameGap: 25
        },
        yAxis: {
          min: min,
          max: max,
          position: 'right',
          bottom: 0,
          name: 'PnL (USD)',
          nameLocation: 'middle',
          nameGap: 50,
          splitLine: {
            lineStyle: {
                color: isDarkTheme  ? '#000000' : '#ffffff' ,
            }
          },
          axisLabel: {
            formatter: function (params : any) {
              return abbreviateNumber(params)
            },
            textStyle: {
                color: isDarkTheme  ? '#ffffff' : '#000000'   ,
            }
          },
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
          <div className="flex flex-col justify-between">
            <h2 className='block mb-2 text-2xl font-medium text-gray-900 dark:text-white'>Position Builder</h2>
            <div className="flex flex-row justify-between">
              <div></div>
              <div>
                <button type="button" 
                  className="text-gray-900 bg-[#EFF2F5] border focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-4  mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={clearChart}
                >
                  Reset Chart
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex justify-between space-between border items-center  border-indigo-500 w-72 md:w-44 px-4 py-4 rounded-lg shadow-sm">
                <span className="text-indigo-500 font-medium text-xs sm:text-sm" >
                  {currentDate}
                </span>
                <span
                  className="flex ml-2 text-indigo-500 font-medium text-lg"
                ><FaCalendarMinus /></span>
              </div>
              <div className="w-full px-8">
                {/* <input id="default-range" type="range" value="50" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"/> */}
              </div>
              <div className="flex justify-between space-between border items-center  border-teal-500 w-72 md:w-44 px-4 py-4 rounded-lg shadow-sm">
                <span className="text-teal-500 font-medium text-xs sm:text-sm" >
                {currentDate}
                </span>
                <span
                  className="flex ml-2 text-teal-500 font-medium text-lg"
                >
                  <FaCalendarPlus />
                </span>
              </div>
            </div>
          </div>
          
            
            <div ref={chartRef}  style={{ width: "100%", height: "600px" }} />
        </div>
    
    </>
  )
}

export default PositionBuilderCharts