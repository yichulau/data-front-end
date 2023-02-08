import React, { useState, useEffect, useRef, useContext } from "react";
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { echartsResize } from '../../../utils/resize';
import MyThemeContext from '../../../store/myThemeContext';

const PositionBuilderCharts = ({data} : any) => {
    console.log(data)
    const { isDarkTheme}= useContext(MyThemeContext); 
    const chartRef = useRef<HTMLDivElement>(null);
    let chart: any;

  
    useEffect(() => {
        if (!chartRef.current) {
          return;
        }
        chart = isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current);
    
    
        // Define the options for the risk graph
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
          xAxis: {
              type: 'value',
              data: [0, 20, 40, 60, 80, 100],
              min: -100,
              max: 100,
              axisLabel: {
                formatter: "{value} %"
              }
          },
          yAxis: {
              min: -2000,
              max: 2000,
              position: 'right',

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
              data
          }]
        };
    
        chart.setOption(options);
        echartsResize(chart)
        return () => {
          chart.dispose();
        };
      }, [data,isDarkTheme]);
    return (
    <>
        <div className='mt-2 mb-2' style={{height: '400px'}}>
            <h2 className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Position Builder</h2>
            <div ref={chartRef}  style={{ width: "100%", height: "400px" }} />
        </div>
    
    </>
  )
}

export default PositionBuilderCharts