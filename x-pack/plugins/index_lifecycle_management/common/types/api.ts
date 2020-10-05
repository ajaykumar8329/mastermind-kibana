/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { NodeDataRoleWithCatchAll } from '.';

export interface ListNodesRouteResponse {
  nodesByAttributes: { [attributePair: string]: string[] };
  nodesByRoles: { [role in NodeDataRoleWithCatchAll]?: string[] };
}
