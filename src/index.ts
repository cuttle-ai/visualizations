// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import QueryResult from './models/query';
import { Viz } from './visualization';
import { TableVisualization } from './table';

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
  }
  return null;
}
export const Init = initViz;
