import compose from '../core/compose';
import { Interceptor } from '../interfaces';

export default class InterceptorController {
  private requestInterceptor: Interceptor[];

  private responseInterceptor: Interceptor[];

  constructor(requestInterceptor, responseInterceptor) {
    this.requestInterceptor = requestInterceptor;
    this.responseInterceptor = responseInterceptor;
  }

  public addReqInterceptor(fn: Interceptor): void {
    this.requestInterceptor.push(fn);
  }

  public addRespInterceptor(fn: Interceptor): void {
    this.requestInterceptor.push(fn);
  }

  public clearRespInterceptor(): void {
    this.requestInterceptor = [];
  }

  public chain<T>(config, fetch): Promise<T> {
    const fnReq = compose(this.requestInterceptor);
    const fnResp = compose(this.responseInterceptor);
    return fnReq(config).then(fetch).then(fnResp);
  }

  public clearReqInterceptor(): void {
    this.requestInterceptor = [];
  }
}
