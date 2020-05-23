// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import QueryResult from './models/query';
import { Viz } from './visualization';
import { TableVisualization } from './table';
import { LineChartVisualization } from './line-chart';
import { ColumnChartVisualization } from './column-chart';
import { PieChartVisualization } from './pie-chart';
import { BarChartVisualization } from './bar-chart';

export * from './models';
export * from './table';
export * from './visualization';

/**
 * will initalize the visualization and return the instance
 * @param id id of the html element on which the table has to be initialized
 * @param queryResult query result based on which the table has to be rendered
 */
export default function initViz(id: string, queryResult: QueryResult): Viz | null {
  /**
   * based on the visualization type we will return the visualization
   */
  if (queryResult?.type === 'TABLE') {
    return new TableVisualization(id, queryResult);
  } else if (queryResult?.type === 'LINECHART') {
    return new LineChartVisualization(id, queryResult);
  } else if (queryResult?.type === 'COLUMNCHART') {
    return new ColumnChartVisualization(id, queryResult);
  } else if (queryResult?.type === 'PIECHART') {
    return new PieChartVisualization(id, queryResult);
  } else if (queryResult?.type === 'BARCHART') {
    return new BarChartVisualization(id, queryResult);
  }
  return null;
}
export const Init = initViz;
