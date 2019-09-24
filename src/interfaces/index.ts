import {
  AxiosResponse,
  AxiosRequestConfig,
} from 'axios';

import { ClassMetaData, MethodMeteData } from '../core/index';


export interface Call {
  enqueue(reqConfig: RequestConfig);
}
export interface KeyValue {
  [key: string]: string;
}
export interface RequestOptions {
  url: string;
  method: any;
  header?: KeyValue[];
}
export type Method =
  | 'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH'


export interface RequestOptiosHandler {
  order?: number;
  handler(
    methodMateData: MethodMeteData,
    classMetaData: ClassMetaData,
    params: any[], config: RequestConfig): RequestConfig;
}
export interface RequestConfig extends AxiosRequestConfig {
  getCancelMessage?(): string;
}
export interface ReftrofitResponse<T = any> extends AxiosResponse<T> {
  [key: string]: any;
}
export interface Interceptor {
  handler(
    context: RequestConfig | ReftrofitResponse): RequestConfig | ReftrofitResponse;
}
