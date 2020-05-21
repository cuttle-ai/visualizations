// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';

import QueryResult from './models/query';
import { VizType, Viz } from './visualization';
import Column from './models/column';

/*
 * This file contains the definition of pie chart visualization
 */

/**
 * PieChartVisualization will draw a pie chart for the given visualization data
 *
 * @example let pcv = new PieChartVisualization(id, queryResult); pcv.render();
 */
export class PieChartVisualization implements Viz {
  /**
   * htmlElementId is the id of the html element on which the pie chart has to be rendered
   */
  htmlElementId: string;
  /**
   * queryResult on which the pie chart visualization is created
   */
  queryResult: QueryResult | null = null;
  /**
   * htmlElement holds the html element instance on which the pie chart is drawn
   */
  htmlElement: HTMLElement | null = null;

  /**
   * type of the visuzaltion is pie chart
   */
  type: VizType = VizType.PieChart;

  /**
   * labelsMap has the label values of slices mapped to their indicies in the chart
   */
  labelsMap = new Map<string, number>();

  /**
   * has the length of slices
   */
  labelsLen: number = 0;

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
    this.htmlElement.innerHTML = '<div id="' + this.htmlElementId + '-cuttle-pie-chart"></div>';
    this.getLabelValues();
    const slices = this.getSlicesValues();
    Highcharts.chart(this.htmlElementId + '-cuttle-pie-chart', {
      chart: {
        type: 'pie',
      },
      title: {
        text: this.queryResult?.title,
      },
      series: slices,
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
    });
  }

  /**
   * returns the xaxis values in the chart in sorted order. Also sets the xaxis valus indicies in xaxis map
   */
  private getLabelValues(): string[] {
    /*
     * We will do a sanity check
     * We will get the group by column name
     * We will map out all the slice label values in sorted order
     * Will set the slices length
     * Will map the the slice label values to their index
     */
    // sanity check for the query result
    if (!this.queryResult?.result || !(this.queryResult?.result instanceof Array) || !this.queryResult?.group_by) {
      return [];
    }

    // getting the slice label
    const label = _.get(this.queryResult, ['group_by', 0, 'name'], '');

    // mapping all the slice label values
    const labels = _.chain(this.queryResult?.result)
      .map((item) => item[label])
      .orderBy()
      .value();

    // mapping the slice label values indices
    _.forEach(labels, (value: string, index: number) => {
      this.labelsMap.set(value, index);
    });

    // set the slice labels length
    this.labelsLen = labels.length;

    return labels;
  }

  /**
   * returns the body of the table as html string
   */
  private getSlicesValues(): Highcharts.SeriesOptionsType[] {
    /*
     * We will do a sanity check for the query result
     * Then we will iterate and map data of each column
     */
    // sanity check for the query result
    if (!this.queryResult?.result || !(this.queryResult?.result instanceof Array)) {
      return [];
    }
    return this.queryResult.select.map((item) => this.getSliceValues(item));
  }

  private getSliceValues(col: Column): Highcharts.SeriesOptionsType {
    /*
     * We will get the xaxis column name
     * Then we will get th unsorted values
     * Then we will get the sorted values
     */
    // getting the label column name
    const label = _.get(this.queryResult, ['group_by', 0, 'name'], '');

    // getting the unsorted values
    const unsorted: any[] = _.chain(this.queryResult?.result)
      .map((item) => ({ y: item[col.name], index: this.labelsMap.get(item[label]), name: item[label] }))
      .value();

    // initializing the slice values
    const slices = new Array<any>(this.labelsLen);

    // getting the sorted values
    for (const slice of unsorted) {
      const index: number = slice.index;
      slices[index] = { name: slice.name, y: +slice.y };
    }

    return {
      data: _.orderBy(slices, ['y'], ['desc']),
      name: col.word,
      type: 'pie',
    };
  }
}
