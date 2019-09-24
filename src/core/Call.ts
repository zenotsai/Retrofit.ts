import axios, { Canceler, AxiosInstance, AxiosResponse } from 'axios';
import { Call, ReftrofitResponse, RequestConfig } from '../interfaces/index';

const { CancelToken } = axios;


export default class CallAxios implements Call {
  private instance: AxiosInstance;

  private cancelToken: Canceler;


  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  enqueue<T = any>(reqConfig: RequestConfig): Promise<AxiosResponse<T>> {
    return new Promise((resolve, reject) => {
      this.instance({
        ...reqConfig,
        cancelToken: new CancelToken(((c): void => {
          this.cancelToken = c;
        })),
      }).then((result) => {
        resolve(result);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  cancel(msg?: string): void {
    this.cancelToken(msg);
  }
}
