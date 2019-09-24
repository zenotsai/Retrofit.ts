import axios, { AxiosInstance } from 'axios';
import InterceptorControll from './interceptor';
import RequestOptionsBuiler from './core/requestBuilber';
import Call from './core/Call';
import { Interceptor } from '../src/interfaces';
import LoggerInterceptor from './interceptor/LoggerInterceptor';

const getMethods = (target, methods = []): string[] => {
  if (target == null) return methods;

  const m = [...Object.getOwnPropertyNames(target).filter((item) => typeof target[item] === 'function'), ...methods];
  return getMethods(target.prototype, m);
};
// eslint-disable-next-line import/prefer-default-export
export class Retrofit {
  private instance: AxiosInstance;

  private interceptorControll: InterceptorControll;

  private requestOptionsBuiler: RequestOptionsBuiler;

  public static Builder = class {
    public mUrl: string;

    public debug: boolean;

    public reqInterceptor: Interceptor[] = [];

    public resInterceptor: Interceptor[] = [];

    public mTimeout: number;

    public mHeader: {
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

    timeout(time: number): this {
      this.mTimeout = time;
      return this;
    }

    baseUrl(url: string): this {
      this.mUrl = url;
      return this;
    }

    headers(header): this {
      this.mHeader = header;
      return this;
    }

    build(): Retrofit {
      if (this.debug) {
        this.addReqInterceptor(new LoggerInterceptor());
      }
      return new Retrofit({
        resInterceptor: this.resInterceptor,
        reqInterceptor: this.reqInterceptor,
        baseURL: this.mUrl,
        timeout: this.mTimeout,
        headers: this.mHeader,
      });
    }
  }

  constructor({
    baseURL, timeout, resInterceptor, reqInterceptor, headers,
  }) {
    const instance = axios.create({
      timeout,
      baseURL,
      headers,
    });
    this.instance = instance;
    this.interceptorControll = new InterceptorControll(reqInterceptor, resInterceptor);
    this.requestOptionsBuiler = new RequestOptionsBuiler({ baseURL, headers });
  }

  getInstance() {
    return this.instance;
  }

  create<T>(targetObj: any): T {
    const _this = this;
    const prox = new Proxy(targetObj, {
      construct(target, args, newTarget) {
        const temp = new targetObj(args);
        getMethods(targetObj).filter((item) => item !== 'constructor').forEach((item) => {
          temp[item] = new Proxy(temp[item], {
            apply(method, thisBinding, args) {
              const config = _this.requestOptionsBuiler.getBuilder(targetObj, item, args);
              const call = new Call(_this.instance);
              const fetch = call.enqueue.bind(call);
              const promise = _this.interceptorControll.chain(config, fetch);
              (<any>promise).cancel = (msg: string) => {
                call.cancel(msg);
              };
              return promise;
            },
          });
        });
        return temp;
      },
    });
    return new prox();
  }
}
