import React, { useContext, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts';
import MyThemeContext from '../../store/myThemeContext';
import moment from 'moment';
import _ from 'lodash';

const GammaExposureProfileChart = ({zeroGammaLevelData, spotPrice, currency, exchange, width} : any) => {
  
  const {levels,
    totalGammaNormalized, 
    totalGammaExNextNormalized, 
    totalGammaExFriNormalized, 
    zeroGamma, 
    fromStrike, 
    toStrike
  } = zeroGammaLevelData;
  const { isDarkTheme }= useContext(MyThemeContext); 
  const chartRef = useRef<HTMLDivElement>(null);
  const resizeObserver : any= useRef(null);
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
  const [chartLoader, setChartLoader] = useState(false)


  const transformedData = levels.map((level : any, index : any) => ({
    levels: level,
    totalGamma: totalGammaNormalized[index],
    totalGammaExNext: totalGammaExNextNormalized[index],
    totalGammaExFri: totalGammaExFriNormalized[index],
  }));

  useEffect(() => {
  
    if (!chartRef.current) {
      return;
    }
    if (!chartInstance) {
      setChartInstance(isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current));
    }

    const option = {
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
          let strike = "";
          for (let i = 0; i < params.length; i++) {
              if (params[i].seriesName !== "") {
                  strike = 'Strike '+ Number(params[0].axisValue).toFixed(2) + "<br/>";
                  str +=  
                      params[i].marker +
                      params[i].seriesName +
                      ' : '+
                      params[i].value[1].toFixed(6) + `` +
                      "<br/>";
              }
          }
          return  strike + str;
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
      toolbox: {
        show: true,
        feature: {
          saveAsImage: { show: true, name:"Gamma Exposure" }
        }
      },
      grid: {
        top: '20%',
        left: width <= 764 ? '7%' : '7%',
        right: '3%',
        bottom: '8%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        boundaryGap: false,
        // data: levels.map((number) => number.toString()),
        min: fromStrike,
        max: toStrike,
        name: 'Strike Price',
        position: 'bottom',
        nameLocation: 'middle',
        nameGap: 25,
        axisLabel: {
          textStyle: {
            color: isDarkTheme  ? '#ffffff' : '#000000',
          }
        },
        splitLine: {
          lineStyle: {
              color: isDarkTheme  ? '#1a1a1a' :  '#f2f2f2',
              type: "dashed",
          }
        },
        nameTextStyle: {
          fontWeight: "bold",
          color: isDarkTheme  ? '#ffffff' : '#000000',
        },
      },
      yAxis: {
        name: 'Gamma Exposure ($ billions/1% move)',
        position: 'left',
        nameLocation: 'middle',
        nameGap: 50,
        bottom: 0,
        nameTextStyle: {
          fontWeight: "bold",
          color: isDarkTheme  ? '#ffffff' : '#000000',
        },
        axisLine: {
          lineStyle: {
            color: isDarkTheme  ? '#ffffff' : '#000000',
          },
        },
        splitLine: {
          lineStyle: {
            color: isDarkTheme  ? '#ffffff' : '#ddd',
            type: "dashed",
          }
        }
      },
      legend: {
          data: ['All Expiries', 'Ex-Next Expiry', 'Ex-Next Monthly Expiry', 'Spot Price', 'Gamma Flip'],
          orient: "horizontal",
          top: 15,
          x: width < 600 ? 'left' :'center',
          textStyle: {
            color: isDarkTheme  ? '#ffffff' : '#000000' ,
            fontSize: width < 600 ? 9 : 12,
          }
      },
      dataZoom: [
        {
            type: 'inside',
            start: 0,
            end: 100,
            xAxisIndex: [0]
          }
      ],
      series: [
        {
          data: transformedData.map((data:any) => [data.levels,data.totalGamma]),
          type: 'line',
          name: 'All Expiries',
          showSymbol: false,
        },
        {
          data: transformedData.map((data:any) => [data.levels,data.totalGammaExNext]),
          type: 'line',
           name: 'Ex-Next Expiry',
          showSymbol: false,
        },
        {
          data: transformedData.map((data:any) => [data.levels,data.totalGammaExFri]),
          type: 'line',
           name: 'Ex-Next Monthly Expiry',
          showSymbol: false,
        },
        { 
          name:'Spot Price',
          type:'line',
          markLine: {
            data: [ 
                { name: 'Spot Price', xAxis: spotPrice.toFixed(2).toString() } ],
            silent: true,
            symbol:'none',
            itemStyle: {
                normal: {
                    // lineStyle: {
                    //     color: 'rgb(126,99,255)',
                    //     type: 'dotted'
                    // },
                    label:{
                        formatter:'{c} (USD)',
                        show:true,
                        fontSize: '10px',
                        position: 'middle',
                        backgroundColor: 'rgb(224,41,74)',
                        color:'#fff',
                        offset: [-20, -3],
                        padding:[5,3],
                        borderRadius: 5,
                    }
                }
            },
          },
        },
        { 
          name:'Gamma Flip',
          type:'line',
          markLine: {
            data: [ 
                { name: 'Gamma Flip', xAxis: zeroGamma.toFixed(2).toString() } ],
            silent: true,
            symbol:'none',
            itemStyle: {
                normal: {
                    // lineStyle: {
                    //     color: 'rgb(126,99,255)',
                    //     type: 'dotted'
                    // },
                    label:{
                        formatter:'{c} (USD)',
                        show:true,
                        fontSize: '10px',
                        position: 'middle',
                        backgroundColor: 'rgb(126,99,255)',
                        color: '#ffffff',
                        offset: [70, -3],
                        padding:[5,3],
                        borderRadius: 5,
                    }
                }
            },
          },
        },
        {
            type: 'line',
            itemStyle: {
                color:  isDarkTheme ?  'rgb(46,189,133,0.4)' : 'rgb(46,189,133,0.1)',
            },
            markArea: {
                silent: true,
                itemStyle: {
                    color:  isDarkTheme ?  'rgb(46,189,133,0.4)' : 'rgb(46,189,133,0.1)',
                },
                data: [
                    [{
                        xAxis: zeroGamma
                    }, {
                        xAxis: toStrike
                    }]
                ],
            },
        },
        {
          type: 'line',
          itemStyle: {
              color:  isDarkTheme ?  'rgb(224,41,74,0.4)' : 'rgb(224,41,74,0.1)',

          },
          markArea: {
              silent: true,
              itemStyle: {
                  color: isDarkTheme ?  'rgb(224,41,74,0.4)' : 'rgb(224,41,74,0.1)',
           
              },
              data: [
                [{
                    xAxis: fromStrike
                }, {
                    xAxis: zeroGamma
                }]
              ],
          },
      },
        
        
      ],

    };

    if (chartInstance) {
      chartInstance.setOption(option);
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
    }
  }, [zeroGammaLevelData,isDarkTheme,chartInstance]);
  
return (
  <>
      <div className='flex w-full bg-white dark:bg-black px-4 py-2 my-2'>
        <div className='w-full py-4 '>
        <div className='font-bold text-md md:text-2xl mb-1 text-center'><h2>{_.startCase(exchange)} Gamma Exposure Profile, {currency}, {moment().format('DD MMM YYYY')}</h2></div>
            <div ref={chartRef}  style={{ width: "100%", height: "400px" }} />
        
        </div>
      </div>
  </>
)
}

export default GammaExposureProfileChart