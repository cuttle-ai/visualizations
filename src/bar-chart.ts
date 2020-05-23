// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';

import QueryResult from './models/query';
import { VizType, Viz } from './visualization';
import Column from './models/column';

/*
 * This file contains the definition of bar chart visualization
 */

/**
 * BarChartVisualization will draw a bar chart for the given visualization data
 *
 * @example let bcv = new BarChartVisualization(id, queryResult); bcv.render();
 */
export class BarChartVisualization implements Viz {
  /**
   * htmlElementId is the id of the html element on which the bar chart has to be rendered
   */
  htmlElementId: string;
  /**
   * queryResult on which the bar chart visualization is created
   */
  queryResult: QueryResult | null = null;
  /**
   * htmlElement holds the html element instance on which the bar chart is drawn
   */
  htmlElement: HTMLElement | null = null;

  /**
   * type of the visuzaltion is bar chart
   */
  type: VizType = VizType.BarChart;

  /**
   * yAxisMap has the y axis values mapped to their indicies in the chart
   */
  yAxisMap = new Map<string, number>();

  /**
   * has the length of elements in the yaxis
   */
  yAxisLen: number = 0;

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
    this.htmlElement.innerHTML = '<div id="' + this.htmlElementId + '-cuttle-bar-chart"></div>';
    const yaxis = this.getYaxisValues();
    const xAxes = this.getXAxesValues();
    Highcharts.chart(this.htmlElementId + '-cuttle-bar-chart', {
      chart: {
        type: 'bar',
      },
      title: {
        text: this.queryResult?.title,
      },
      xAxis: {
        categories: yaxis,
      },
      series: xAxes,
      plotOptions: {
        bar: {
          pointPadding: 0.2,
          borderWidth: 0,
          borderRadius: 5,
        },
      },
    });
  }

  /**
   * returns the yaxis values in the chart in sorted order. Also sets the xaxis valus indicies in yaxis map
   */
  private getYaxisValues(): string[] {
    /*
     * We will do a sanity check
     * We will get the group by column name
     * We will map out all the xaxis values in sorted order
     * Will set the yaxis lengtyh
     * Will map the the yaxis values to their index
     */
    // sanity check for the query result
    if (!this.queryResult?.result || !(this.queryResult?.result instanceof Array) || !this.queryResult?.group_by) {
      return [];
    }

    // getting the yaxis column name
    const yValue = _.get(this.queryResult, ['group_by', 0, 'name'], '');

    // mapping all the yaxis values
    const yValues = _.chain(this.queryResult?.result)
      .map((item) => item[yValue])
      .orderBy()
      .value();

    // mapping the yaxis values indices
    _.forEach(yValues, (value: string, index: number) => {
      this.yAxisMap.set(value, index);
    });

    // set the yaxis length
    this.yAxisLen = yValues.length;

    return yValues;
  }

  /**
   * returns the body of the table as html string
   */
  private getXAxesValues(): Highcharts.SeriesOptionsType[] {
    /*
     * We will do a sanity check for the query result
     * Then we will iterate and map data of each column
     */
    // sanity check for the query result
    if (!this.queryResult?.result || !(this.queryResult?.result instanceof Array)) {
      return [];
    }
    return this.queryResult.select.map((item) => this.getXAxisValues(item));
  }

  private getXAxisValues(col: Column): Highcharts.SeriesOptionsType {
    /*
     * We will get the yaxis column name
     * Then we will get th unsorted values
     * Then we will get the sorted values
     */
    // getting the yaxis column name
    const yValue = _.get(this.queryResult, ['group_by', 0, 'name'], '');

    // getting the unsorted values
    const unsorted: any[] = _.chain(this.queryResult?.result)
      .map((item) => ({ x: item[col.name], index: this.yAxisMap.get(item[yValue]) }))
      .value();

    // initializing the xaxis values
    const xValues = new Array<any>(this.yAxisLen);

    // getting the sorted values
    for (const xValue of unsorted) {
      const index: number = xValue.index;
      xValues[index] = +xValue.x;
    }

    return { data: xValues, name: col.word, type: 'bar' };
  }
}
