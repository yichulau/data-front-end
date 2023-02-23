import React, { useState, useEffect, useRef, useContext } from "react";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../../utils/resize';
import MyThemeContext from '../../../store/myThemeContext';
import abbreviateNumber from "../../../utils/numberFormatter";
import { FaCalendarPlus,FaCalendarMinus } from 'react-icons/fa';
import moment from "moment";
import ribbonImg from "../../../../public/assets/ribbon-logo.png";

const PositionBuilderCharts = ({data, amount, indexPrice, resetChart, latestDate} : any) => {
    
    const { isDarkTheme}= useContext(MyThemeContext); 
    const chartRef = useRef<HTMLDivElement>(null);
    const xMin = 0
    const xMax = Number(indexPrice*4)
    const min = Number(-indexPrice*4);
    const max = Number(indexPrice*4);
    const currentDate = moment(new Date()).format('DD-MM-YYYY')
    const lateDate = moment(latestDate).format('DD-MM-YYYY')
    const firstArray = data.map((item : any) => [item[0], item[1]]);
    const secondArray = data.map((item : any) => [item[0], item[2]]);
    let chart: any;

  // console.log(data)
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
                  let strLabel = params[i].seriesIndex === 0 ? `Expiry PnL` : `Today PnL`
                  let markerStyle = params[i].seriesIndex === 0 ? '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:rgb(126,99,255);"></span>' : '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:rgb(46,189,133);"></span>'
                  if (params[i].seriesName !== "") {
                      str +=  
                          `Index Price Change` +
                          ' : '+
                          Number(params[i].value[0]).toFixed(2)+ ` (USD)` +
                          "<br/>" +
                          markerStyle + strLabel +
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
          data: [],
          min: xMin,
          max: xMax,
          axisLabel: {
            formatter: "{value}",
            textStyle: {
              color: isDarkTheme  ? '#ffffff' : '#000000'   ,
            }
          },
          splitLine: {
            lineStyle: {
                color: isDarkTheme  ? '#1a1a1a' :  '#f2f2f2',
            }
          },
          name: 'Index Price',
          position: 'bottom',
          nameLocation: 'middle',
          nameGap: 25
        },
        graphic: [{
          elements: [{
            type: 'image',
            style: {
              image: ribbonImg.src,
              width: 300,
              height: 300,
              opacity: 0.09
            },
            left: 'center',
            top: 'center'
            
          }]
        }],
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
                color: isDarkTheme  ? '#1a1a1a' :  '#f2f2f2' ,
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
            xAxisIndex: 0,
            filterMode: 'filter',
            moveOnMouseMove: true,
            zoomOnMouseWheel: true,
            start:10,
            end: 35,
          },
          {
            type: 'slider',
            xAxisIndex: 0,
            show: false,
            filterMode: 'filter',
            moveOnMouseMove: true,
            zoomOnMouseWheel: true,
            start:10,
            end: 35,
          },
          {
            type: 'inside',
            yAxisIndex: [0],
            orient: 'vertical',
            filterMode: 'none',
            moveOnMouseMove: true,
            zoomOnMouseWheel: true,
            start:45,
            end: 55,

          },
          {
            type: 'slider',
            yAxisIndex: [0],
            orient: 'vertical',
            show: false,
            filterMode: 'none',
            start:45,
            end: 55,
            moveOnMouseMove: true,
            zoomOnMouseWheel: true,
          }
        ],
        series: [{
          type: 'line',
          smooth: true,
          areaStyle:{},
          data: firstArray,
          showSymbol: false,
          markLine: {
            silent: true,
            label: {
              normal: {
               show: true,
               formatter: function (params : any) {
                return 'Index Price: $' + params.value
              },
              }
            },
            data: [{
                name: 'verticalLine',
                xAxis: indexPrice, // specify the x-axis value at which to draw the line
            }],
            lineStyle: {
              normal: {
                type:'dashed',
                color: 'green',
              }
            },
          },
          itemStyle: {
            normal:{
              lineStyle:{
                widtth: 2,
                color: 'rgb(126,99,255)'
              }
            }
          },
        },{
          type: 'line',
          smooth: true,
          areaStyle:{
            normal: {
              color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                      {
                          offset: 0,
                          color: 'rgba(107,205,216,0.5)',
                      },
                      {
                          offset: 1,
                          color: 'rgba(143,192,127,0)',
                      },
                  ],
                  false
              ),
          },
          },
          data: secondArray,
          showSymbol: false,
          markLine: {
            silent: true,
            label: {
              normal: {
               show: true,
               formatter: function (params : any) {
                return 'Index Price: $' + params.value
              },
              }
            },
            data: [{
                name: 'verticalLine',
                xAxis: indexPrice, // specify the x-axis value at which to draw the line
            }],
            lineStyle: {
              normal: {
                type:'dashed',
                color: 'green',
              }
            },
          },
          itemStyle: {
            normal:{
              lineStyle:{
                widtth: 2,
                color: '#00a8a0'
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
            <h2 className='block mb-2 text-lg font-medium text-gray-900 dark:text-white'>Position Builder</h2>
            <div className="flex flex-row justify-between">
              <div></div>
              <div>
                <button type="button" 
                  className="text-gray-900 bg-[#EFF2F5] border focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2.5 py-2.5  mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                  onClick={clearChart}
                >
                  Reset Chart
                </button>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center">
              <div className="flex justify-between space-between border items-center  border-indigo-500 w-72 md:w-44  px-2.5 py-2.5 rounded-lg shadow-sm">
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
              <div className="flex justify-between space-between border items-center  border-teal-500 w-72 md:w-44  px-2.5 py-2.5 rounded-lg shadow-sm">
                <span className="text-teal-500 font-medium text-xs sm:text-sm" >
                {lateDate ? lateDate : latestDate}
                </span>
                <span
                  className="flex ml-2 text-teal-500 font-medium text-lg"
                >
                  <FaCalendarPlus />
                </span>
              </div>
            </div>
          </div>
          
            
            <div ref={chartRef}  style={{ width: "100%", height: "500px" }} />
        </div>
    
    </>
  )
}

export default PositionBuilderCharts