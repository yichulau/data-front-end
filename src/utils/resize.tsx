const echartsDom : any = [];

export function echartsResize(eDom: any) {   
    echartsDom.push(eDom);
    window.onresize = () => {
        echartsDom.forEach((it: any)=>{
            it.resize();
        })
    };
}