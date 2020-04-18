// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Metric from './metric';

/*
 * This file contains the model for visualization
 */

/**
 * Visualization gives visual representation for data in terms of charts, tables, etc.
 */
export default interface Visualization {
    metrics: Metric[]; // metrics in the visualization
    type: string; // type of visualization
    title: string; // title of the visualization
    description: string; // description for the visualization
}