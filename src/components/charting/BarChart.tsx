import React, { useEffect, useState, useRef } from 'react'
import { Select, Form } from "antd";  
import * as echarts from 'echarts'; 
import { echartsResize } from '../../utils/resize';

const BarChart = ({ data }: any) => {

  let dataValues = data; 
  const chartRef = useRef<any>(null);
  const { Option } = Select;
  const [filter, setFilter] = useState(0); // 0 for filter by coin, 1 for filter by exchange
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
    style: { width: "400px" },
  }; 

  // Filter data by exchange
  // Sum of total of btc and sum of total of eth across all exchanges
  const getDataByExchange = () => {
    let points = []; 

    if (dataValues.length > 0) {
      points.push(dataValues[0]["count24H"] + dataValues[1]["count24H"]); // Bit.com
      points.push(dataValues[2]["count24H"] + dataValues[3]["count24H"]); // Binance
      points.push(dataValues[4]["count24H"] + dataValues[5]["count24H"]); // Deribit 
      points.push(dataValues[6]["count24H"] + dataValues[7]["count24H"]); // Bybit 
      points.push(dataValues[8]["count24H"] + dataValues[9]["count24H"]); // OKEX
    } 

    return {
      tooltip: {},
      legend: {
        data: ["No of Contracts in Past 24 Hours"],
      },
      xAxis: {
        data: ["Bit.com", "Binance", "Deribit", "Bybit", "OKEX"],
      },
      yAxis: {
        name: "Volume",
      },
      series: [
        {
          name: "No of Contracts in Past 24 Hours",
          type: "bar",
          data: points,
        },
      ],
    };  
  }; 

  // Filter data by coin 
  // Accumulate all 5 exchange of the btc & eth value,
  // X-Axis only shows BTC and ETH 
  const getDataByCoin = () => {

    let sumETH = 0; 
    let sumBTC = 0; 
    let points = []; 

    for (let i = 0; i < dataValues.length; i++){
      if (i % 2 == 0){
        sumETH += dataValues[i]["count24H"]; 
      } else {
        sumBTC += dataValues[i]["count24H"]; 
      }
    }; 

    points.push(sumETH); 
    points.push(sumBTC); 

    return {
      tooltip: {},
      legend: {
        data: ["No of Contracts in Past 24 Hours"],
      },
      xAxis: {
        data: ["ETH", "BTC"],
      },
      yAxis: {
        name: "Volume",
      },
      series: [
        {
          name: "No of Contracts in Past 24 Hours",
          type: "bar",
          data: [sumETH, sumBTC],
        },
      ],
    };    
  };

  // this will be triggered by the useEffect
  const getOptions = (value: number) => {

    switch (value) {
      case 0: 
        return getDataByCoin(); 

      case 1: 
        return getDataByExchange(); 

      default: 
        break; 
    }
  }; 

  const handleFilterChange = (value: number) => {
    setFilter(value); 
  }; 
  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    let options = getOptions(filter); 
    chartInstance.setOption(options); 

    echartsResize(chartInstance);
  }, [data, filter]);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <br />
        <Form {...layout}>
          <Form.Item>
            <Select 
              defaultValue={filter} 
              onChange={handleFilterChange}>
                <Option value={0}>By Currency</Option>
                <Option value={1}>By Exchange</Option>
            </Select>
          </Form.Item>
        </Form>
        <div ref={chartRef} style={{ height: "400px", width:"100%" }}></div>
      </div>
    </>
  )
}

export default BarChart