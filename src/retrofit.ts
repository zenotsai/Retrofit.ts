import axios, { AxiosInstance } from 'axios';
import InterceptorControll from './interceptor';
import RequestOptionsBuiler from './core/requestBuilber';
import Call from './core/Call';
import { Interceptor, ErrorHandler } from './interfaces';
import LoggerInterceptor from './interceptor/LoggerInterceptor';

const getMethods = (target, methods = []): string[] => {
  if (target == null) return methods;

  const m = [...Object.getOwnPropertyNames(target).filter((item) => typeof target[item] === 'function'), ...methods];
  return getMethods(target.prototype, m);
};
// eslint-disable-next-line import/prefer-default-export
export class Retrofit {
  private instance: AxiosInstance;

  private errorHandler: ErrorHandler;

  private interceptorControll: InterceptorControll;

  private requestOptionsBuiler: RequestOptionsBuiler;

  public static Builder = class {
    public url: string;

    public debug: boolean;

    public reqInterceptor: Interceptor[] = [];

    public resInterceptor: Interceptor[] = [];

    public timeout: number;

    public errorHandler: ErrorHandler;

    public header: {
      [key: string]: string;
    }

    addReqInterceptor(fn: Interceptor): this {
      this.reqInterceptor.push(fn);
      return this;
    }

    setDebug(flag): this {
      this.debug = flag;
      return this;
    }

    addRespInterceptor(fn: Interceptor): this {
      this.resInterceptor.push(fn);
      return this;
    }

    setTimeout(time: number): this {
      this.timeout = time;
      return this;
    }

    setBaseUrl(url: string): this {
      this.url = url;
      return this;
    }

    setHeaders(header: {
      [key: string]: string;
    }): this {
      this.header = header;
      return this;
    }

    setErrorHandler(handler: ErrorHandler): this {
      this.errorHandler = handler;
      return this;
    }

    build(): Retrofit {
      if (this.debug) {
        this.addReqInterceptor(new LoggerInterceptor());
      }
      return new Retrofit({
        errorHandler: this.errorHandler,
        resInterceptor: this.resInterceptor,
        reqInterceptor: this.reqInterceptor,
        baseURL: this.url,
        timeout: this.timeout,
        headers: this.header,
      });
    }
  }

  constructor({
    errorHandler, baseURL, timeout, resInterceptor, reqInterceptor, headers,
  }) {
    const instance = axios.create({
      timeout,
      baseURL,
      headers,
    });
    this.errorHandler = errorHandler;
    this.instance = instance;
    this.interceptorControll = new InterceptorControll(reqInterceptor, resInterceptor);
    this.requestOptionsBuiler = new RequestOptionsBuiler({ baseURL, headers });
  }

  getInstance() {
    return this.instance;
  }

  create<T>(targetObj: any): T {
    const _this = this;
    const Prox = new Proxy(targetObj, {
      construct(target, args, newTarget) {
        const temp = new targetObj(args);
        getMethods(targetObj).filter((item) => item !== 'constructor').forEach((item) => {
          temp[item] = new Proxy(temp[item], {
            apply(method, thisBinding, args) {
              const config = _this.requestOptionsBuiler.getBuilder(targetObj, item, args);
              const call = new Call(_this.instance);
              const fetch = call.enqueue.bind(call);
              const promise = _this.interceptorControll.chain(config, fetch).catch((e) => {
                _this.errorHandler && _this.errorHandler(e);
                return Promise.reject(e);
              });
              (<any>promise).cancel = (msg: string) => {
                call.cancel.call(call, msg);
              };
              return promise;
            },
          });
        });
        return temp;
      },
    });
    return new Prox();
  }
}
