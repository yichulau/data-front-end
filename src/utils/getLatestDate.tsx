export default function getLatestDate(dates : any) {
    let latestDate = new Date(dates[0]);
  
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      if (currentDate > latestDate) {
        latestDate = currentDate;
      }
    }
  
    return latestDate.toISOString().split('T')[0];
  }