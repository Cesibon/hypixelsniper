import { Component } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';


navigator.permissions.query({ name: "clipboard-write" }).then(result => {
    if (result.state == "granted" || result.state == "prompt") {
        /* write to the clipboard now */

    }
});

export default class Grid extends Component {

    firstCellRenderer = (params) => {
        return <span>
            <button onClick={() => {
                navigator.clipboard.writeText('/viewauction ' + params.data.uuid)
            }}>Copy link</button>
        </span>
    }


    render() {
        const defaultColDef = {
            sortable: true,
            resizable: true,
            filter: 'agTextColumnFilter',
            filterParams: { buttons: ['reset'] }
        };

        return (
            <div className="flex h-full">
                <div className="ag-theme-alpine-dark flex-grow" style={{ textAlign: 'left' }}>
                    <AgGridReact
                        frameworkComponents={{
                            firstCellRenderer: this.firstCellRenderer
                        }}
                        defaultColDef={defaultColDef}
                        suppressDragLeaveHidesColumns={true}
                        rowData={this.props.rowData}
                        onGridReady={this.onGridReady.bind(this)}>
                        <AgGridColumn
                            cellRenderer="firstCellRenderer"
                            sortable={false}
                            resizable={false}
                            width="100"></AgGridColumn>
                        <AgGridColumn headerName="Name" field='name'></AgGridColumn>
                        <AgGridColumn headerName="Price" field='price' cellClass='number-cell' filter="agNumberColumnFilter" valueFormatter={this.currencyFormatter.bind(this)}></AgGridColumn>
                        <AgGridColumn headerName="Next price" field='next_price' cellClass='number-cell' filter="agNumberColumnFilter" valueFormatter={this.currencyFormatter.bind(this)}></AgGridColumn>
                        <AgGridColumn headerName="Spread" field='price_float' cellClass='number-cell' filter="agNumberColumnFilter" valueFormatter={this.currencyFormatter.bind(this)}></AgGridColumn>
                        <AgGridColumn headerName="Item count" field='count' filter="agNumberColumnFilter"></AgGridColumn>
                    </AgGridReact>
                </div>

            </div>
        );
    }

    currencyFormatter(params) {
        return '$' + this.formatNumber(params.value);
    }

    formatNumber(number) {
        // this puts commas into the number eg 1000 goes to 1,000,
        // i pulled this from stack overflow, i have no idea how it works
        return Math.floor(number)
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }

    autoSizeAll(skipHeader = false) {
        if (this.state.columnApi) {
            const allColumnIds = [];
            const columns = this.state.columnApi.getAllColumns()
            if (columns) columns.forEach((column) => {
                if (column.colDef.resizable) allColumnIds.push(column.getId());
            });
            this.state.columnApi.autoSizeColumns(allColumnIds, skipHeader);
        }
    }

    onGridReady(params) {
        // or setState if using components
        this.setState({
            gridApi: params.api,
            columnApi: params.columnApi
        })
        this.autoSizeAll();
    }
}
