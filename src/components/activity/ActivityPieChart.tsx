import React, { useEffect,useState, useRef, useContext, useMemo } from 'react'
import * as echarts from 'echarts';
import ReactEcharts from "echarts-for-react";
import { echartsResize } from '../../utils/resize';
import MyThemeContext from '../../store/myThemeContext';

const ActivityPieChart = ({data}: any) => {
    const { isDarkTheme}= useContext(MyThemeContext); 
    const chartRef: any = useRef();
    const responseData = useMemo(()=> data, [data]);
    const [chartInstance, setChartInstance] = useState<any>(null);
    const sumOfContracts = responseData.reduce((accumulator:any,currentVal:any) => {
        return accumulator + currentVal.count24h 
    },0)




    useEffect(()=>{
        if (!chartRef.current) {
            return;
        }
        if (!chartInstance) {
            setChartInstance(isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current));
        }


        const chartData : any = responseData.map((item:any) => ({
            value: item.count24h,
            name: item.exchange
        }));

        const colorList = ['#88D9FF', '#0092FF', '#81EDD2', '#B0FA93', '#63F2FF', '#9999FE'];
        const sum = chartData.reduce((per:any, cur:any) => per + cur.value, 0);
        const gap = (1 * sum) / 100;
        const pieData1 = [];
        const pieData2 = [];
        const gapData = {
          name: '',
          value: gap,
          itemStyle: {
            color: 'transparent',
          },
        };

        let lefts = ['4%', '4%', '4%', '80%', '80%', '80%'];
        let tops = ['24%', '40%', '55%', '24%', '40%', '55%'];
        let legendData = [];
        let total = 0;
        chartData.forEach((item: any) => {
          total += item.value;
        });
    
        for (let i = 0; i < chartData.length; i++) {
          pieData1.push({
            ...chartData[i],
            itemStyle: {
              borderRadius: 10,
            },
          });
          pieData1.push(gapData);
    
          pieData2.push({
            ...chartData[i],
            itemStyle: {
              color: colorList[i],
              opacity: 0.21,
            },
          });
          pieData2.push(gapData);
    
          let bfb = Math.round((chartData[i].value / total) * 100).toString() + '%';
          legendData.push({
            show: true,
            icon: 'circle',
            left: lefts[i],
            top: tops[i],
            itemStyle: {
              color: colorList[i],
            },
            formatter: `{aa| ${chartData[i].name} }\n\n{bb| ${bfb}}`,
            x: 'left',
            textStyle: {
              rich: {
                aa: {
                  color: isDarkTheme ? "#f5f5f6" : '#000000',
                },
                bb: {
                  color: colorList[i],
                },
              },
            },
            data: [(chartData[i].name)],
          });
        }
    
        console.log(legendData)

        const option = {
            backgroundColor: isDarkTheme ? '#000000':  '#ffffff' ,

            title: {
                text: "Total Traded",
                subtext: sumOfContracts,
                x: "49.7%",
                y: "35%",
                itemGap:15,
                textStyle: {
                  color: isDarkTheme ? "#f5f5f6" : '#000000' ,
                  fontSize: 15,
                  fontWeight: "bold",
                },
                subtextStyle: {
                   
                  color: isDarkTheme ? "#f5f5f6" : '#000000' ,
                  fontSize: 30,
                  fontWeight: "bold",
                },
                textAlign:'center'
            },
            tooltip: {
              show: true,
              backgroundColor: 'rgba(0, 0, 0,.8)',
              textStyle: {
                color: '#fff',
              },
            },
            legend: legendData,
            grid: {
              top: 30,
              right: 20,
              bottom: 10,
              left: 10,
            },
            color: colorList,
            series: [
              {
                name: '',
                type: 'pie',
                roundCap: true,
                radius: ['66%', '70%'],
                center: ['50%', '45%'],
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                data: pieData1,
              },
              {
                type: 'pie',
                radius: ['66%', '60%'],
                center: ['50%', '45%'],
                gap: 1.71,
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                silent: true,
                data: pieData2,
              },
              {
                type: 'gauge',
                zlevel: 2,
                splitNumber: 90,
                radius: '60%',
                center: ['50%', '45%'],
                startAngle: 90,
                endAngle: -269.9999,
                axisLine: {
                  show: false,
                },
                axisTick: {
                  show: false,
                },
                axisLabel: {
                  show: false,
                },
                splitLine: {
                  show: true,
                  length: 7,
                  lineStyle: {
                    width: 4,
                    color: 'rgb(33,85,130)',
                  },
                },
                pointer: {
                  show: 0,
                },
                detail: {
                  show: 0,
                },
              },
              {
                type: 'pie',
                center: ['50%', '45%'],
                radius: [0, '45.6%'],
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                itemStyle: {
                  color: 'rgba(75, 126, 203,.1)',
                },
                silent: true,
                data: [
                  {
                    value: 100,
                    name: '',
                  },
                ],
              },
            ],
        };
        if (chartInstance) {
        chartInstance.setOption(option);
        echartsResize(chartInstance)
        }
      },[data,isDarkTheme])

  return (
   <>
    <div className='text-center font-bold text-md md:text-2xl dark:text-white px-2 py-2'>Total Contracts Traded For The Past 24 Hours Across Exchanges</div>
    <div className='mt-2 mb-2 pb-2 items-center justify-center text-center' style={{maxWidth: "100%",height: '300px'}}>
          <div ref={chartRef} style={{height: "310px", width:'100%'}}></div>
    </div>
   </>
  )
}

export default ActivityPieChart