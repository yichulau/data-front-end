export default function abbreviateNumber(num : number) {
    if (num === 0) return '0';
  
    const absNum = Math.abs(num);
    if (absNum >= 1e6) {
      return (num / 1e6).toFixed(1) + 'M';
    } else if (absNum >= 1e3) {
      return (num / 1e3).toFixed(1) + 'k';
    } else {
      return num.toString();
    }
  }