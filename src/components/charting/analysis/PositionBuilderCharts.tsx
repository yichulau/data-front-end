import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../../utils/resize';
import MyThemeContext from '../../../store/myThemeContext';
import abbreviateNumber from "../../../utils/numberFormatter";
import { FaCalendarPlus,FaCalendarMinus } from 'react-icons/fa';
import moment from "moment";
import ribbonImg from "../../../../public/assets/ribbon-logo.png";
import BlackScholes from "../../../utils/blackScholes";
import { optionsCalculation } from "../../../utils/optionsCalculation";
import { chartDataHelper, optionsGenerateDataHelper } from "../../../utils/chartDataHelper";

const PositionBuilderCharts = ({data, amount, indexPrice, resetChart, latestDate} : any) => {

    const { isDarkTheme}= useContext(MyThemeContext); 
    const chartRef = useRef<HTMLDivElement>(null);
    const resizeObserver : any= useRef(null);
    const dataArray = useMemo(() => data, [data]);
    const [sliderValue, setSliderValue] = useState<number>(0);
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartInstance, setChartInstance] = useState<any>(null);

    const xMin = 0
    const xMax = Number(indexPrice*4)
    const min = Number(-indexPrice*4*amount);
    const max = Number(indexPrice*4*amount);

    const currentDated  = moment(new Date());
    const expiryDate =  moment(latestDate);
    const diffTime = expiryDate.diff(currentDated, 'days');


    const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>)=>{
      const currencyType = dataArray[0].symbol
      const interval = currencyType === 'BTC' ?  500 : 50;
      const currentDated  = moment(new Date());
      const expiryDate =  moment(latestDate);
      const diffTime = expiryDate.diff(currentDated, 'days');
      const sliderValue = Number(event.target.value)
      const diffValue = diffTime - sliderValue
      const newResultArr : any = chartDataHelper(dataArray, diffValue);
      const dataSet : any = newResultArr.length > 0 ? optionsCalculation.getOptionsGraph(newResultArr, interval) : []
      const output = newResultArr.length > 0 ? optionsGenerateDataHelper(dataSet) : []
      setChartData(output)
      setSliderValue(sliderValue)
    }
    
   
    const clearChart = () =>{
      resetChart()
    }


    useMemo(()=>{
      const currencyType =  dataArray.length> 0 ? dataArray[0].symbol : ''
      const interval = currencyType === 'BTC' ?  500 : 50;
      const currentDated  = moment(new Date());
      const expiryDate =  moment(latestDate);
      const diffTime = expiryDate.diff(currentDated, 'days');
      const newResultArr : any = chartDataHelper(dataArray, diffTime);
      const dataSet : any = newResultArr.length > 0 ? optionsCalculation.getOptionsGraph(newResultArr,interval) : []
      const output = newResultArr.length > 0 ? optionsGenerateDataHelper(dataSet) : []
      setChartData(output);
    },[data])



    useEffect(() => {
      if (!chartRef.current) {
        return;
      }
      if (!chartInstance) {
        setChartInstance(isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current));
      }
  
      const options = {
        darkMode: true,
        backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
        toolbox: {
          itemGap: 10,
          itemSize: 16,
          right: 70,
          iconStyle: {
            borderColor: 'rgb(126,99,255)',
          },
          feature: {
            restore: {},
            saveAsImage: {
              name: 'Position Builder'
            }
          },
        },
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
          top: '8%',
          left: '2%',
          right: '4%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          min: xMin,
          max: xMax,
          axisLabel: {
            formatter: function(value : any, index: any) {
              return value.toFixed(0); // format value to integer
            },
            textStyle: {
              color: isDarkTheme  ? '#ffffff' : '#000000'   ,
            }
          },
          splitLine: {
            lineStyle: {
                color: isDarkTheme  ? '#1a1a1a' :  '#f2f2f2',
            }
          },
          axisTick: {
            length: 6,
            lineStyle: {
              type: 'dashed'
              // ...
            }
          },
          axisPointer: {
            handle: {
              throttle: 500
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
              color: isDarkTheme  ? '#ffffff' : '#000000',
            }
          },
          axisLine: {
            lineStyle: {
              color: 'transparent', // set the color to transparent
            },
          },
        },
        
        dataZoom: [
          {
            type: 'inside',
            xAxisIndex: 0,
            filterMode: 'none',
            moveOnMouseMove: true,
            zoomOnMouseWheel: true,
            start:10,
            end: 35,
          },
          {
            type: 'slider',
            xAxisIndex: 0,
            show: false,
            filterMode: 'none',
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
                          color: 'rgba(107,205,216,0.4)',
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
          data: chartData.map((data:any) => [data.x,data.optionsDataAtExpiry]),
          showSymbol: false,
          markLine: {
            data: [
                { name: 'index Price',xAxis:indexPrice},
            ],
            silent: true,
            symbol:'none',//去掉箭头
            itemStyle: {
                normal: {
                    lineStyle: {
                        color: 'rgb(126,99,255)',
                        type: 'dotted'
                    },
                    label:{
                        // color: '#FA7F3C',
                        formatter:'Index Price: {c} (USD)',
                        show:true,
                        backgroundColor: 'rgb(126,99,255)',
                        color: '#ffffff',
                        fontSize: '100%',
                        borderColor: '#FFF7F2',
                        // formatter: function(v){
                        //     var s = parseInt(v.value / maxxAxis * 100);
                        //     return s + '%';
                        // },
                        padding:[12,7],
                        borderRadius: 10,
                    }
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
          },
          data: chartData.map((data:any) => [data.x,data.optionsData]),
          showSymbol: false,
  
          itemStyle: {
            normal:{
              lineStyle:{
                width: 2,
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
      
      if (chartInstance) {
        chartInstance.setOption(options);
        resizeObserver.current = new ResizeObserver(() => {
            chartInstance.resize();
        });
          resizeObserver.current.observe(chartRef.current);
        return () => {
        // Clean up the observer on component unmount
           if (chartRef.current) {
              resizeObserver.current.unobserve(chartRef.current);
            }
        };
        // echartsResize(chartInstance)
      }
    }, [data,isDarkTheme,chartData,chartInstance]);

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
              <div className="flex flex-row justify-between space-between border items-center text-center md:text-left border-indigo-500 w-40 md:w-44  px-1 py-1  md:px-2.5 md:py-2.5 rounded-lg shadow-sm">
                <span className="text-indigo-500 font-medium text-xs sm:text-sm" >
                  {moment().add(sliderValue, 'days').format('DD-MM-YYYY')}
                </span>
                <span
                  className="flex ml-2 text-indigo-500 font-medium text-xs md:text-lg"
                ><FaCalendarMinus /></span>
              </div>
              <div className="w-full px-4 md:px-8 text-center pt-2">
                <input 
                  id="small-range"
                  type="range"
                  min="0"
                  max={diffTime}
                  value={sliderValue}
                  onChange={handleChangeDate}
                className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer range-sm dark:bg-gray-700"/>
              </div>
              <div className="flex flex-row justify-between space-between border items-center text-center md:text-left  border-teal-500  w-40 md:w-44  px-1 py-1  md:px-2.5 md:py-2.5 rounded-lg shadow-sm">
                <span className="text-teal-500 font-medium text-xs sm:text-sm" >
                {moment(latestDate).format('DD-MM-YYYY')}
                </span>
                <span
                  className="flex ml-2 text-teal-500 font-medium text-xs md:text-lg"
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