// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import * as $ from 'jquery';
import 'datatables.net'

import QueryResult from './models/query';
import { VizType, Viz } from './visualization';

/*
 * This file contains the definition of table visualization
 */

/**
 * TableVisualization will draw a table for the given visualization data
 * 
 * @example let tv = new TableVisualization(id, queryResult); tv.render();
 */
export class TableVisualization implements Viz {
    /**
     * htmlElementId is the id of the html element on which the table has to be rendered
     */
    htmlElementId: string;
    /**
     * queryResult on which the table visualization is created
     */
    queryResult: QueryResult | null = null;
    /**
     * htmlElement holds the html element instance on which the table is drawn
     */
    htmlElement: HTMLElement | null = null;

    /**
     * type of the visuzaltion is table
     */
    type: VizType = VizType.Table;

    /**
     * columnMap has the columns mapped to their index in the table
     */
    columnMap = new Map<string, number>();
    /**
     * columns has the number of columns in the table
     */
    columns = 0;

    /**
     * initializes the table visualization
     * @param id id of the html element on which the table has to initialized
     * @param queryResult query result based on which the table has to be created
     */
    constructor(id: string, queryResult: QueryResult) {
        this.htmlElementId = id;
        const ele = document.getElementById(id);
        if (!ele) {
            return;
        }
        this.htmlElement = ele;
        this.queryResult = queryResult;
        this.render();
    }

    /**
     * render renders the html element with the table
     */
    render() {
        if (!this.htmlElement) {
            return;
        }
        const headers = this.getHeaders();
        const body = this.getBody();
        this.htmlElement.innerHTML = '<table id="' + this.htmlElementId + '-cuttle-table">' + headers + body + '</table>';
        let tableId: any = $('#' + this.htmlElementId + '-cuttle-table');
        tableId.DataTable();
    }

    /**
     * returns the header of table as html string
     */
    private getHeaders(): string {
        /*
         * We will do a sanity check for the query result 
         * Then we will iterate through the select and group by columns
         * and write them as th
         */
        // sanity check for the query result
        if (!this.queryResult?.select && !this.queryResult?.group_by) {
            return '';
        }
        let result = '<thead><tr>';

        // iterating though the select columns to add th
        const selectColumns = (this.queryResult?.select || []);
        let counter = 0;
        for (const col of selectColumns) {
            result += '<th>' + col.word + '</th>';
            this.columnMap.set(col.name, counter);
            counter++;
        }
        // iterating though the group by columns to add th
        const groupByColumns = (this.queryResult?.group_by || []);
        for (const col of groupByColumns) {
            result += '<th>' + col.word + '</th>';
            this.columnMap.set(col.name, counter);
            counter++;
        }
        this.columns = counter;

        return result + '</tr></thead>';
    }

    /**
     * returns the body of the table as html string
     */
    private getBody(): string {
        /*
         * We will do a sanity check for the query result 
         * Then we will iterate through the result of the query
         * For each data item, we will iterate through the properties and add to indices
         * Then add them to the cell
         */
        // sanity check for the query result
        if (!this.queryResult?.result || !(this.queryResult?.result instanceof Array)) {
            return '';
        }
        let result = '<tbody>';

        // iterating though the data
        const data = this.queryResult?.result;
        for (const row of data) {
            const dt = new Array(this.columns);
            for (const prop in row) {
                if (!row.hasOwnProperty(prop)) {
                    continue;
                }
                const index = this.columnMap.get(prop) || 0;
                dt[index] = '<td>' + row[prop] + '</td>';
            }
            result += '<tr>';
            for (const d of dt) {
                result += d;
            }
            result += '</tr>';
        }

        return result + '</tbody>';
    }
}