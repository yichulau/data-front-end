import React, { useContext, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts';
import MyThemeContext from '../../store/myThemeContext';
import moment from 'moment';
import _ from 'lodash';

const AbsoluteGammaExposureChart = ({ strikes, dfAgg, spotPrice, currency , exchange, width  } : any) => {
  const { isDarkTheme }= useContext(MyThemeContext); 
    const totalGammas = Object.values(dfAgg).map((val : any) => val.TotalGamma);
    const sumOfTotalGamma = totalGammas.reduce((arr,curr) => arr+curr, 0).toFixed(2)
    const chartRef = useRef<HTMLDivElement>(null);
    const resizeObserver : any= useRef(null);
    const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);
    const [chartLoader, setChartLoader] = useState(false)  
    const fromStrike = strikes[0]
    const toStrike = 2 * spotPrice
    const totalGammaData = Object.keys(dfAgg).map(key => ({
      strike: Number(key),
      ...dfAgg[key]
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
        grid: {
          top: '20%',
          left: width <= 764 ? '7%' : '5%',
          right: '3%',
          bottom: '8%',
          containLabel: true
        },
        color:['rgb(126,99,255)'],
        legend: {
          data: ['Total Gamma','Spot Price'],
          orient: "horizontal",
          top: 15,
          textStyle: {
            color: isDarkTheme  ? '#ffffff' : '#000000'   ,
          }
        },
        toolbox: {
          show: true,
          feature: {
            saveAsImage: { show: true, name:"Gamma Calls " }
          }
        },
        xAxis: {
          type: "value", // need to change to value
          // data: xAxisData,
          min: fromStrike,
          max: toStrike,
          name: 'Strike Price',
          position: 'bottom',
          nameLocation: 'middle',
          nameGap: 25,
          axisLabel: {
            textStyle: {
              color: isDarkTheme  ? '#ffffff' : '#000000'   ,
            }
          },
          splitLine: {
            lineStyle: {
                color: isDarkTheme  ? '#1a1a1a' :  '#f2f2f2',
            }
          },
          nameTextStyle: {
            fontWeight: "bold",
            color: isDarkTheme  ? '#ffffff' : '#000000'   ,
          },
          
        },
        yAxis: {
          type: "value",
          name: "Spot Gamma Exposure ($ billions/1% move)",
          position: 'left',
          nameLocation: 'middle',
          nameGap: 50,
          bottom: 0,
          nameTextStyle: {
            fontWeight: "bold",
            color: isDarkTheme  ? '#ffffff' : '#000000'   ,
          },
          axisLine: {
            lineStyle: {
              color: isDarkTheme  ? '#ffffff' : '#000000'   ,
            },
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
        },
        dataZoom: [
          {
              type: 'inside',
              start: 15,
              end: 85,
              xAxisIndex: [0]
            }
        ],
        series: [
          {
            type: "bar",
            data: totalGammaData.map((data:any) => [data.strike,data.TotalGamma]),
            name:'Total Gamma',
            barWidth: 6,
            itemStyle: {
              color: 'rgb(46,189,133)'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                  {
                    offset: 1,
                    color: 'rgb(46,189,133)'
                  }
                ])
            }
          },
          { 
            name:'Spot Price',
            type:'line',
            markLine: {
              data: [ 
                  { name: 'Spot Price', xAxis: spotPrice.toString() } ],
              silent: true,
              symbol:'none',
              itemStyle: {
                  normal: {
                      lineStyle: {
                          color: 'rgb(126,99,255)',
                          type: 'dotted'
                      },
                      label:{
                          formatter:'{c} (USD)',
                          show:true,
                          backgroundColor: 'rgb(126,99,255)',
                          color: '#ffffff',
                          fontSize: '100%',
                          borderColor: '#FFF7F2',
                          padding:[10,7],
                          borderRadius: 10,
                      }
                  }
              },
            },
          //   markLine: {
          //     silent: true, // ignore mouse events
          //     label: {show: true},
          //     data: [ 
          //       { name: 'Spot Price', xAxis: spotPrice.toString() }
          //     ]
          //  }
          },
        ],
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
                    strike = 'Strike '+ params[0].value[0] + "<br/>";
                    str +=  
                        params[i].marker +
                        params[i].seriesName +
                        ' : '+
                        params[i].value[1].toFixed(8) + `` +
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
      }

  
      if (chartInstance) {
        chartInstance.setOption(option);
        chartInstance.on('finished', () => {
          setChartLoader(false)
          // Perform any operations that require the chart to be fully loaded here
        });
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
    }, [dfAgg,isDarkTheme,chartInstance]);


  return (
    <>
        <div className='flex w-full bg-white dark:bg-black px-4 py-2 my-2'>
          <div className='w-full py-4'>
              <div className='font-bold text-md md:text-2xl mb-1 text-center'><h2>{_.startCase(exchange)} Total Gamma: ${sumOfTotalGamma} Bn per 1% ${currency} Move On {moment().format('DD MMM YYYY')}</h2></div>
              <div ref={chartRef}  style={{ width: "100%", height: "400px" }} />
          
          </div>
        </div>
    </>
  )
}

export default AbsoluteGammaExposureChart