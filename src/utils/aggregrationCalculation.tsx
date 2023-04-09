import moment from "moment";

export default function aggregrationCalculation(dataset : any){
    let aggregatedData : any= {};
    let dataCount :any= {};
    const currentDate = moment().format("DD-MM-yyyy");

    for (let exchange in dataset) {
      let exchangeData = dataset[exchange];
  
      for (let i = 0; i < exchangeData.length; i++) {
        let dataPoint = exchangeData[i];
        let value = dataPoint[0];
        let date = dataPoint[1];
  
        let dateParts = date.split(' ');
        let dateString = dateParts[0];
  
        if (!aggregatedData[dateString]) {
          aggregatedData[dateString] = {};
          dataCount[dateString] = {};
        }
  
        if (!aggregatedData[dateString][exchange]) {
          aggregatedData[dateString][exchange] = dateString === currentDate ? { value: 0, timestamp: "" } : 0;
          dataCount[dateString][exchange] = 0;
        }
  
        if (dateString === currentDate) {
          const currentTimestamp = moment(date, "DD-MM-yyyy HH:mm:ss");
          const lastDataPoint = aggregatedData[dateString][exchange];
  
          if (!lastDataPoint.timestamp || currentTimestamp.isAfter(moment(lastDataPoint.timestamp, "DD-MM-yyyy HH:mm:ss"))) {
            aggregatedData[dateString][exchange] = { value, timestamp: date };
          }
        } else {
          aggregatedData[dateString][exchange] += value;
          dataCount[dateString][exchange]++;
        }
      }
    }
  
    let outputData : any = {};
  
    for (let date in aggregatedData) {
      for (let exchange in aggregatedData[date]) {
        let value = date === currentDate ? aggregatedData[date][exchange].value : aggregatedData[date][exchange] / dataCount[date][exchange];
        let dateAndTime = date + ' 00:00:00';
              
        if (!outputData[exchange]) {
          outputData[exchange] = [];
        }
        
        outputData[exchange].push([value, dateAndTime]);
      }
    }
  
    for (let exchange in outputData) {
      outputData[exchange].sort((a : any, b : any) => {
        let dateA  :any= new Date(a[1]);
        let dateB : any= new Date(b[1]);
        return dateA - dateB;
      });
    }

    return outputData;
}