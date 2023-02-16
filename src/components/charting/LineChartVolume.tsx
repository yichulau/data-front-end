import React, { useEffect,useState, useRef, useContext, useMemo } from 'react'
import * as echarts from 'echarts';
import ReactEcharts from "echarts-for-react";
import DropdownCoin from '../misc/DropdownCoin';
import { echartsResize } from '../../utils/resize';
import moment from 'moment';
import MyThemeContext from '../../store/myThemeContext';
import DropdownIndex from '../misc/DropdownIndex';
import DropdownLeft from '../misc/DropdownLeft';


const LineChartVolume = ({data : dataSet , earliestTimestamp, latestTimeStamp , onChange} :any) => {
    const { isDarkTheme}= useContext(MyThemeContext); 
    const chartRef = useRef<HTMLDivElement>(null);
    const [filter, setFilter] = useState(0);
    const [granularity, setGranularity] = useState(0);
    let data = useMemo(()=> dataSet, [dataSet])
    let xData: any = [];
    let chart: any;

    const volumeOption = [
      {id: 0, value: 'Notional'},
      {id: 1, value: 'Premium'}
    ]
    const coinExchangeOption = [
        {id: 0, value: 'BTC'},
        {id: 1, value: 'ETH'},
        {id: 2, value: 'SOL'},
    ]

    const granularityOption = [
      {id: 0, value: '1D'},
      {id: 1, value: 'Raw'}
    ]
    
    const handleFilterChange = (value: number) => {
      setFilter(value); 
    }; 

    const getDataByCoin = (coin : string) =>{
      const filteredDataset = data.filter(({ coinCurrencyID } :any) => coinCurrencyID === coin);
      const dailyAverages = [];
      const dailyValues : any= {};
      let xData: string[] = [];

      filteredDataset.forEach((item:any)=>{
        xData.push(moment.unix(item.ts).format('DD-MM-YYYY HH:mm:ss'));
      })
      const filterTimeFormat = filteredDataset.map((obj : any)=>{
        const formattedDate = moment.unix(obj.ts).format('DD-MM-YYYY HH:mm:ss');
        return { ...obj, ts: formattedDate };
      })

      for (const dataPoint of filterTimeFormat) {
        const date = dataPoint.ts.split(" ")[0];
        if (!dailyValues[date]) {
          dailyValues[date] = {
            total: dataPoint.value,
            count: 1
          };
        } else {
          dailyValues[date].total += dataPoint.value;
          dailyValues[date].count++;
        }
      }

      for (const date in dailyValues) {
        const average = dailyValues[date].total / dailyValues[date].count;
        dailyAverages.push({
          ts: moment(date, "DD-MM-YYYY HH:mm:ss").unix(),
          value: average,
          coinCurrencyID: coin
        });
      }

      if(granularity === 0){
        const filteredDates = xData.map(dateString => dateString.slice(0, 10));
        const uniqueDates = Array.from(new Set(filteredDates)).map((obj: any)=>{return obj});
        xData = uniqueDates;
      }

    
      return [granularity === 0 ? dailyAverages : filteredDataset, xData]
    } 

    const handleFilterVolChange = (value : number) =>{
      onChange(value)
    }

    const handleGranularityChange = (value : number ) =>{
      setGranularity(value)
    }

    useEffect(()=>{
      if (!chartRef.current) {
        return;
      }
      const end =  latestTimeStamp;
      const start = earliestTimestamp;
      chart = isDarkTheme ?  echarts.init(chartRef.current,'dark') :  echarts.init(chartRef.current);
      chart.clear(); // clear off any previous plotted chart 

      switch (filter) {
       
        case 0: 
        data = getDataByCoin('BTC')[0];
        xData = getDataByCoin('BTC')[1];  
        break; 

        case 1: 
        data = getDataByCoin('ETH')[0];
        xData = getDataByCoin('ETH')[1];
        break; 

        case 2: 
        data = getDataByCoin('SOL')[0];
        xData = getDataByCoin('SOL')[1];
        break; 
      
        default: 
          break; 
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
            let timing = "";
            for (let i = 0; i < params.length; i++) {
                if (params[i].seriesName !== "") {
                    let value = params[i].value
                    if (value >= 1000000000){
                      value = Number(value / 1000000000).toFixed(2) + 'B';
                    }
                    if (value >= 1000000) {
                      value = Number(value / 1000000).toFixed(2) + 'M';
                    }
                    timing = granularity === 0 ? params[0].name.slice(0,10) : params[0].name
                    strike = 'Time: '+ timing + "<br/>";
                    str +=  
                        params[i].marker +
                        params[i].seriesName +
                        ' : $'+
                        value + ` ` +
                        "<br/>";
                }
            }
            return  strike + str;
          }
        },
        legend: {
          data: ['Options Volume'],
          orient: 'horizontal',
          x: window.innerWidth < 600 ? 'left' :'center',
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true, name:"Options Volume By Coin " }
          }
        },
        grid: {
          top: '18%',
          left: '4%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel:{
            formatter: function (value: any) {
                const formatDate = value
                return formatDate;
            }
          },
          data: xData
        },
        yAxis: {
          type: 'value',
          name: `Options Vol (${filter === 0 ? 'BTC' : (filter === 1 ? 'ETH' : (filter === 2 ? 'SOL' : ''))})`,
          boundaryGap: [0, '100%'],
          axisLabel:{
            formatter: function (value: any) {
                if (value >= 1000000) {
                    value = value / 1000000 + 'M';
                }
                return value;
            },
          }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
            xAxisIndex: [0]
          },
          {
            type: 'slider',
            start: 0,
            end: 100,
            xAxisIndex: [0],
          }
        ],
        series: [
            {
              name: 'Options Volume',
              type: 'line',
              symbol: 'none',
              sampling: 'lttb',
              itemStyle: {
                color: 'rgb(46,189,133)'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(46,189,133)'
                  }
                ])
              },
              data: data
            }
          ]
      }

      chart.setOption(option)
      echartsResize(chart);
      return () => {
        chart.dispose();
      };
    },[data,filter, isDarkTheme, granularity])
    
   

  return (
    <>
    <h2 className="ml-2 text-lg font-medium text-gray-900 mt-4 mb-4 dark:text-white">Chart Of Options Volume By Coin</h2>
    <div style={{ textAlign: "left" }}>

        <div className='flex flex-row justify-between mb-6'>
            <div className='flex'>
                <div className='px-2 flex flex-col'>
                    <DropdownCoin 
                        title={`By Coin`}
                        options={coinExchangeOption}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className='px-2 flex flex-col'>
                    <DropdownIndex 
                        title={`Type`}
                        options={volumeOption}
                        onChange={handleFilterVolChange}
                    />
                </div>
                <div className='px-2 flex flex-col'>
                    <DropdownLeft 
                        title={`Granularity`}
                        options={granularityOption}
                        onChange={handleGranularityChange}
                    />
                </div>
   
               
            </div>
        </div>
        <div ref={chartRef}  style={{ height: '400px', width:'100%'}}></div>
    </div>
   </>
  )
}

export default LineChartVolume