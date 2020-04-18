// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

/*
 * This file contains the model for column being visualized
 */

/**
 * Column has the information on the column being displayed in the visualization
 */
export default interface Column {
  uid: string; // unique id of the table
  word: string; // display name of the table
  puid: string; // unique id of the parent - table
  name: string; // name of the table
  children: any[]; // children of the table are columns
  measure: boolean; // flag indicates whether the column is of the type measure
  dimension: boolean; // flag indicates whether the column is of the type dimension
  aggregation_fn: AggreagationFn; // the default aggreagation function to be used for the column
  data_type: DataType; // data_type of the column
  description: string; // description of the table
}

/**
 * DataType of the column
 */
export enum DataType {
  String = 'STRING',
  Int = 'INT',
  Float = 'FLOAT',
  Date = 'DATE',
}

/**
 * AggreagationFn for the columns
 */
export enum AggreagationFn {
  Count = 'COUNT',
  Sum = 'SUM',
  Avg = 'AVG',
}
