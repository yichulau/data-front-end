export default function aggregrationCalculation(dataset : any){
    let aggregatedData : any= {};
    let dataCount :any= {};
  
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
          aggregatedData[dateString][exchange] = 0;
          dataCount[dateString][exchange] = 0;
        }
        
        aggregatedData[dateString][exchange] += value;
        dataCount[dateString][exchange]++;
      }
    }
  
    let outputData : any = {};
  
    for (let date in aggregatedData) {
      for (let exchange in aggregatedData[date]) {
        let value = aggregatedData[date][exchange] / dataCount[date][exchange];
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