export default function calculateRatio(num_1 :number, num_2:number){
    for( let num=num_2; num>1; num--) {
        if((num_1 % num) == 0 && (num_2 % num) == 0) {
            num_1=num_1/num;
            num_2=num_2/num;
        }
    }
    let ratio = ((num_1/num_2));
    let roundOff = Math.round(ratio * 100) / 100
    return roundOff ? roundOff : 0;
}