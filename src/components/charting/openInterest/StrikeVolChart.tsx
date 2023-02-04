import React, { useEffect,useState, useRef, useContext } from 'react'
import * as echarts from 'echarts';
import ReactEcharts from "echarts-for-react";
import calculateRatio from '../../../utils/calculateRatio';
import MyThemeContext from '../../../store/myThemeContext';
import { echartsResize } from '../../../utils/resize';

const StrikeVolChart = ({data ,error, loading, ccyOption} : any) => {
  const { isDarkTheme}= useContext(MyThemeContext); 
  const chartRef: any = useRef();
  const responseData = data.data;
  const {  data: oiData } = responseData;
  let chart: any;
   

  useEffect(()=>{
    chart = isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current);
    const option = {
      backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
      tooltip: {
        show: true,
        trigger: 'axis',
        textStyle: {
            color: '#fff',
            fontSize: 14
        },
        backgroundColor: 'rgba(18, 57, 60, .8)', //设置背景颜色
        borderColor: "rgba(18, 57, 60, .8)",
        formatter: function (params : any) {
          let str = "";
          let strike = "";
          for (let i = 0; i < params.length; i++) {
              if (params[i].seriesName !== "") {
                  strike = 'Expiry '+ params[0].name + "<br/>";
                  str +=  
                      params[i].marker +
                      params[i].seriesName +
                      ' : '+
                      params[i].value + ` ${ccyOption}` +
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
      legend: {
          data: ['Call Trading Volume', 'Put Trading Volume'],
          orient: "horizontal",
          bottom: 0
      },
      toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true, name: "Options Open Interest Volume By Strike" }
          }
      },  
      xAxis: {
        type: "category",
        data: oiData.keyList,
      },
      yAxis: {
        type: "value",
        name: `Open Interest Vol (${ccyOption})`,
        axisLabel:{
          formatter: function (value: any) {
              if (value >= 1000) {
                  value = value / 1000 + 'K';
              }
              return value;
          }
        }
      },
      grid: {
        top: '18%',
        left: '2%',
        right: '4%',
        bottom: '8%',
        containLabel: true
      },
      series: [
        {
          data: oiData.callVolList,
          name: "Call Trading Volume",
          stack: "one",
          type: "line",
          smooth: true,
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
            },
          emphasis: {
              focus: 'series'
          },
        },
        {
          data: oiData.putVolList,
          name: "Put Trading Volume",
          stack: "one",
          type: "line",
          smooth: true,
          itemStyle: {
              color: 'rgb(224,41,74)'
            },
          areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 1, 1, 1, [
                {
                  offset: 0,
                  color: 'rgb(224,41,74)'
                }
              ])
            },
          emphasis: {
              focus: 'series'
          },
        },
      ],
  };
    chart.setOption(option);
    echartsResize(chart)
    return () => {
      chart.dispose();
    };
  },[data,isDarkTheme])



  return (
    <>
         <div className='mt-2 mb-2' style={{ maxWidth: "100%", maxHeight: "400px" }}>
            <div ref={chartRef} style={{height: "310px"}}></div>
            <div className='flex flex-row items-center justify-center mt-6'>
                <div className="py-4 px-4 text-center">
                    <div className="text-xs md:text-lg  border-b border-[#16c784] font-bold">Call Open Interest Volume</div>
                    <div className='text-xs md:text-lg font-bold'>{oiData.callVol} {ccyOption}</div>
                </div>
                <div className="py-4 px-4 text-center">
                    <div className="text-xs md:text-lg  border-b border-[#ea3943] font-bold">Put Open Interest Volume</div>
                    <div className='text-xs md:text-lg font-bold'>{oiData.putVol} {ccyOption}</div>
                </div>
                <div className="py-4 px-4 text-center">
                    <div className="text-xs md:text-lg  font-bold">Call/Put Ratio</div>
                    <div>
                        <div className="border-b border-[#ea3943]" style={{float: 'left', width: '50%'}}></div>
                        <div className="border-b border-[#16c784]" style={{float: 'left', width: '50%'}}></div>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div className='text-xs md:text-lg font-bold'>{calculateRatio(oiData.callVol,oiData.putVol)}</div>
                </div>
            </div>
            {/* <style jsx>{`
                @media (max-width: 767px) {
                div.resizing {
                    height: 200px;
                }
                }
            `}</style> */}
        </div>
    </>
  )
}

export default StrikeVolChart