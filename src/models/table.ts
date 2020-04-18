// Copyright 2019 Cuttle.ai. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.
import Column from './column';

/*
 * This file contains the model for table whose data is being visualized
 */

/**
 * Table has the information the table whose data is displayed in the visualization
 */
export default interface Table {
  uid: string; // unique id of the table
  word: string; // display name of the table
  puid: string; // unique id of the parent
  name: string; // name of the table
  children: Column[]; // children of the table are columns
  default_date_field_uid: string; // uid of the default date field of the table
  default_date_field: Column; // default date field in the table
  description: string; // description of the table
  datastore_id: number; // id of the datastore where the table is stored
}
