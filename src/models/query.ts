// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Column from './column';
import Visualization from './visualization';

/*
 * This file contains the model for cuttle query
 */

/**
 * Query has the information the query for which the data is displayed in the visualization
 */
export interface Query {
  tables: object; // object contains the tables mapped to their ids
  select: Column[]; // list of columns selected in the query
  group_by: Column[]; // list of columns used for group by in the query
  result: any; // contains the result of the query
}

/**
 * QueryResult has the query, its result and suggested visualization
 */
export default interface QueryResult extends Query, Visualization {}
