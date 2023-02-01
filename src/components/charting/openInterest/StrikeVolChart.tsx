import React, { useEffect,useState, useRef } from 'react'
import * as echarts from 'echarts';
import ReactEcharts from "echarts-for-react";
import calculateRatio from '../../../utils/calculateRatio';

const StrikeVolChart = ({data ,error, loading} : any) => {
    const responseData = data.data;
    const {  data: oiData } = responseData;
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
              label: {
                show: true
              }
            },
            // position: function (pt: any) {
            //     return [pt[0], '10%'];
            //   },
            formatter: (params : any) => {
              return `
                        <div style="font-weight: bold">Strike Price: ${params[0].axisValue} </div> 

                        ${params[0].seriesName}: ${params[0].value}<br />
                        ${params[1].seriesName}: ${params[1].value}
                        `;
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
          name: "Open Interest Volume By Coin",
          axisLabel:{
            formatter: function (value: any) {
                if (value >= 1000) {
                    value = value / 1000 + 'K';
                }
                return value;
            }
          }
        },
        grid:{
            bottom: 60
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


  return (
    <>
         <div className='mt-2 mb-2' style={{ maxWidth: "100%", maxHeight: "400px" }}>
            <ReactEcharts option={option} />
            <div className='flex flex-row items-center justify-center mt-6'>
                <div className="py-4 px-4 text-center">
                    <div className="text-xs md:text-lg  border-b border-[#16c784] font-bold">Call Open Interest Volume</div>
                    <div className='font-bold'>{oiData.callVol} BTC</div>
                </div>
                <div className="py-4 px-4 text-center">
                    <div className="text-xs md:text-lg  border-b border-[#ea3943] font-bold">Put Open Interest Volume</div>
                    <div className='font-bold'>{oiData.putVol} BTC</div>
                </div>
                <div className="py-4 px-4 text-center">
                    <div className="text-xs md:text-lg  font-bold">Call/Put Ratio</div>
                    <div>
                        <div className="border-b border-[#ea3943]" style={{float: 'left', width: '50%'}}></div>
                        <div className="border-b border-[#16c784]" style={{float: 'left', width: '50%'}}></div>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div className='font-bold'>{calculateRatio(oiData.callVol,oiData.putVol)}</div>
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