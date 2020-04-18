// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

/*
 * This file contains the model for metric
 */

/**
 * Metric is holds information about metrics used in the visualization.
 * This is the column/field values in the data
 */
export default interface Metric {
  resource_id: string; // id of the item which is represented by the metric
  display_name: string; // name to be used as a display
  name: string; // actual item in the data
  measure: boolean; // states whether the metric is a measure type
  dimension: boolean; // states whether the metric is a dimension type
}
