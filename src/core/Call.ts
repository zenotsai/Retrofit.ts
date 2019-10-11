import axios, { Canceler, AxiosInstance, AxiosResponse } from 'axios';
import { Call, ReftrofitResponse, RequestConfig } from '../interfaces/index';

const { CancelToken } = axios;
const source = CancelToken.source();

export default class CallAxios implements Call {
  private instance: AxiosInstance;

  private cancelToken: Canceler;


  constructor(instance: AxiosInstance) {
    this.instance = instance;
  }

  enqueue<T = any>(reqConfig: RequestConfig): Promise<AxiosResponse<T>> {
    const that = this;
    return this.instance({
      ...reqConfig,
      cancelToken: new CancelToken(((c): void => {
        that.cancelToken = c;
      })),
      // cancelToken: source.token,
    });
  }

  cancel(msg?: string): void {
    // source.cancel(msg);
    this.cancelToken && this.cancelToken();
  }
}
