
export const daysTillExpiry = (date1 : any, date2: any) => {
    const firstDate: any = new Date(date1);
    const secondDate : any= new Date(date2);
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = (secondDate - firstDate)/msPerDay;
    return diff < 0 ? 0 : diff;
  }
  
export const getCurrentDate = () => {
  var today : any = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = mm + '-' + dd + '-' + yyyy;
  return today;
}

export const getMaxDate = (dates : any) => {
  return new Date(Math.max.apply(null, dates.map((date: any) => { 
    return new Date(date);
  })));
}
  