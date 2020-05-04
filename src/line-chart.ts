// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';

import QueryResult from './models/query';
import { VizType, Viz } from './visualization';
import Column from './models/column';

/*
 * This file contains the definition of line chart visualization
 */

/**
 * LineChartVisualization will draw a line chart for the given visualization data
 *
 * @example let lcv = new LineChartVisualization(id, queryResult); lcv.render();
 */
export class LineChartVisualization implements Viz {
  /**
   * htmlElementId is the id of the html element on which the line chart has to be rendered
   */
  htmlElementId: string;
  /**
   * queryResult on which the line chart visualization is created
   */
  queryResult: QueryResult | null = null;
  /**
   * htmlElement holds the html element instance on which the line chart is drawn
   */
  htmlElement: HTMLElement | null = null;

  /**
   * type of the visuzaltion is line chart
   */
  type: VizType = VizType.LinceChart;

  /**
   * xAxisMap has the x axis values mapped to their indicies int he chart
   */
  xAxisMap = new Map<string, number>();

  /**
   * has the length of elements in the xaxis
   */
  xAxisLen: number = 0;

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
    this.htmlElement.innerHTML = '<div id="' + this.htmlElementId + '-cuttle-line-chart"></div>';
    const xaxis = this.getXaxisValues();
    const yAxes = this.getYAxesValues();
    Highcharts.chart(this.htmlElementId + '-cuttle-line-chart', {
      title: {
        text: this.queryResult?.title,
      },
      xAxis: {
        categories: xaxis,
      },
      series: yAxes,
    });
  }

  /**
   * returns the xaxis values in the chart in sorted order. Also sets the xaxis valus indicies in xaxis map
   */
  private getXaxisValues(): string[] {
    /*
     * We will do a sanity check
     * We will get the group by column name
     * We will map out all the xaxis values in sorted order
     * Will set the xaxis lengtyh
     * Will map the the xaxis values to their index
     */
    // sanity check for the query result
    if (!this.queryResult?.result || !(this.queryResult?.result instanceof Array) || !this.queryResult?.group_by) {
      return [];
    }

    //getting the xaxis column name
    const xValue = _.get(this.queryResult, ['group_by', 0, 'name'], '');

    //mapping all the xaxis values
    const xValues = _.chain(this.queryResult?.result)
      .map((item) => item[xValue])
      .orderBy()
      .value();

    //mapping the xaxis values indices
    _.forEach(xValues, (value: string, index: number) => {
      this.xAxisMap.set(value, index);
    });

    //set the xaxis length
    this.xAxisLen = xValues.length;

    return xValues;
  }

  /**
   * returns the body of the table as html string
   */
  private getYAxesValues(): Array<Highcharts.SeriesOptionsType> {
    /*
     * We will do a sanity check for the query result
     * Then we will iterate and map data of each column
     */
    // sanity check for the query result
    if (!this.queryResult?.result || !(this.queryResult?.result instanceof Array)) {
      return [];
    }
    return this.queryResult.select.map((item) => this.getYAxisValues(item));
  }

  private getYAxisValues(col: Column): Highcharts.SeriesOptionsType {
    /*
     * We will get the xaxis column name
     * Then we will get th unsorted values
     * Then we will get the sorted values
     */
    //getting the xaxis column name
    const xValue = _.get(this.queryResult, ['group_by', 0, 'name'], '');

    //getting the unsorted values
    const unsorted: Array<any> = _.chain(this.queryResult?.result)
      .map((item) => ({ y: item[col.name], index: this.xAxisMap.get(item[xValue]) }))
      .value();

    //initializing the yaxis values
    const yValues = new Array<any>(this.xAxisLen);

    //getting the sorted values
    for (const yValue of unsorted) {
      const index: number = yValue.index;
      yValues[index] = +yValue.y;
    }

    return { data: yValues, name: col.word, type: 'line' };
  }
}
