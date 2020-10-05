/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { HttpFetchError } from 'kibana/public';
import Boom from 'boom';

export interface EsErrorRootCause {
  type: string;
  reason: string;
}

export interface EsErrorBody {
  error: {
    root_cause?: EsErrorRootCause[];
    caused_by?: EsErrorRootCause;
    type: string;
    reason: string;
  };
  status: number;
}

export interface MLResponseError {
  statusCode: number;
  error: string;
  message: string;
  attributes?: {
    body: EsErrorBody;
  };
}

export interface MLErrorObject {
  message: string;
  statusCode?: number;
  fullError?: EsErrorBody;
}

export interface MLHttpFetchError<T> extends HttpFetchError {
  body: T;
}

export type ErrorType = MLHttpFetchError<MLResponseError> | EsErrorBody | Boom | string | undefined;

export function isEsErrorBody(error: any): error is EsErrorBody {
  return error && error.error?.reason !== undefined;
}

export function isErrorString(error: any): error is string {
  return typeof error === 'string';
}

export function isMLResponseError(error: any): error is MLResponseError {
  return typeof error.body === 'object' && 'message' in error.body;
}

export function isBoomError(error: any): error is Boom {
  return error.isBoom === true;
}
