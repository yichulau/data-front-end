import React, { useCallback, useMemo, useState} from 'react'
import moment from 'moment';
import "@glideapps/glide-data-grid/dist/index.css";
import { DataEditor, GridCell, GridCellKind, GridColumn, Item } from '@glideapps/glide-data-grid';

type DataRow = {
    ID: number;
    coinCurrencyID: number;
    instrumentID: string;
    tradeID: any;
    tradeTime: number;
    tickDirection?: number;
    price: string;
    indexPrice: string;
    markPrice?: string;
    direction?: string;
    amount: number;
    exchangeID: number;
    type: string;
    isBlockTrade?: number;
    optionType: string;
};


const ActivityDataGrid  = ({data } :any) => {
    const dataSet = useMemo(()=> data, [data])

    const columns : GridColumn[] = [

        { title: "Trade Time", id: "tradeTime" },
        { title: "ID", id: "ID" },
        { title: "Exchange ID", id: "exchangeID" },
        { title: "Instrument ID", id: "instrumentID" },
        { title: "Trade ID", id: "tradeID" },
        { title: "Price", id: "price" },
        { title: "Index Price", id: "indexPrice" },
        { title: "Amount", id: "amount" },
        { title: "Option Type", id: "optionType" },
    ];



    const basicGetCellContent = useCallback((cell: Item): GridCell => {
        
        const [col, row] = cell;
        const dataRow: any = dataSet[row];
        console.log(dataRow)
    
        const indexes: any[] = ["tradeTime","ID", "exchangeID", "instrumentID","tradeID","price", "indexPrice","amount", "optionType"];
        const d = dataRow[indexes[col]];
        return {
            kind: GridCellKind.Text,
            allowOverlay: true,
            readonly: false,
            displayData: String(d),
            data: String(d),
        };
    }, []);

  return (
   <>
        <DataEditor 
            getCellContent={data.length> 0 ? basicGetCellContent: data} 
            columns={columns} 
            rows={data.length}
            getCellsForSelection={true}
        />
   </>
  )
}

export default ActivityDataGrid