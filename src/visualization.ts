// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import QueryResult from './models/query';

/*
 * This file contains the definition of visualization
 */

/**
 * Viz holds the visualization instance
 */
export interface Viz {
    /**
     * type is type of visualization
     */
    type: VizType;
}

/**
 * VizType indicates the type of visualization
 */
export enum VizType { Table = 1 };