// import * as Url from 'url';
import * as queryString from 'query-string';
import MetaData, { ClassMetaData, MethodMeteData } from './index';
import { RequestOptiosHandler, RequestConfig } from '../interfaces/index';

export default class RequestOptionsBuiler {
  buildArr: RequestOptiosHandler[] = [];

  private rootConfig: RequestConfig;

  private builderUrl(): RequestOptiosHandler {
    const _this = this;
    return {
      order: 0,
      handler(
        methodMetaData: MethodMeteData,
        classMetaData: ClassMetaData,
        params: any[], config: RequestConfig,
      ): RequestConfig {
        let url = classMetaData.baseUrl || '';
        const mapParams = methodMetaData.pathParams;
        const requestConfig = config;
        requestConfig.method = methodMetaData.method;
        url = `${url}${methodMetaData.url}`;
        if (mapParams) {
          mapParams.forEach((value, key) => {
            if (!params[value]) return;
            if (typeof params[value] === 'object') {
              Object.keys(params[value]).forEach((objKey) => {
                url = url.replace(`:${key}.${objKey}`, params[value][objKey]);
              });
              return;
            }
            url = url.replace(`:${key}`, params[value]);
          });
        }
        requestConfig.baseURL = _this.rootConfig.baseURL;
        requestConfig.url = url;
        return requestConfig;
      },
    };
  }


  private builderQuery(): RequestOptiosHandler {
    return {
      order: 1,
      handler(
        methodMateData: MethodMeteData,
        classMetaData: ClassMetaData,
        parameter: any[], config: RequestConfig,
      ): RequestConfig {
        const { queryParams } = methodMateData;
        const requestConfig = config;
        const { url } = requestConfig;

        if (!url) return config;
        if (queryParams) {
          const params = {};
          queryParams.forEach((value, key) => {
            params[key] = parameter[value];
          });
          requestConfig.url = `${url}?${queryString.stringify(params)}`;
        }
        return requestConfig;
      },
    };
  }

  private builderHeaders(): RequestOptiosHandler {
    return {
      order: 2,
      handler(
        methodMetaData: MethodMeteData,
        classMetaData: ClassMetaData,
        params: any[], config: RequestConfig,
      ): RequestConfig {
        const requestConfig = config;
        const classHeader = classMetaData.headers;
        const headers = requestConfig.headers || Object.create(null);
        if (!Array.isArray(classHeader) || classHeader.length === 0) return requestConfig;
        classHeader.forEach((item) => {
          const [key, value] = item.split(':');
          if (key && value) {
            headers[key] = value;
          }
        });
        requestConfig.headers = headers;
        return requestConfig;
      },
    };
  }

  private builderBody(): RequestOptiosHandler {
    return {
      order: 3,
      handler(
        methodMateData: MethodMeteData,
        classMetaData: ClassMetaData,
        parameter: any[], config: RequestConfig,
      ): RequestConfig {
        const { bodyParams } = methodMateData;
        const requestConfig = config;
        if (bodyParams) {
          const params = {};
          bodyParams.forEach((value, key) => {
            params[key] = parameter[value];
          });
          requestConfig.data = params;
        }
        return requestConfig;
      },
    };
  }

  private builderHeader(): RequestOptiosHandler {
    return {
      order: 4,
      handler(
        methodMetaData: MethodMeteData,
        classMetaData: ClassMetaData,
        params: any[], config: RequestConfig,
      ): RequestConfig {
        const requestConfig = config;
        const headers = requestConfig.headers || Object.create(null);
        const { headerParams } = methodMetaData;
        if (headerParams) {
          headerParams.forEach((value, key) => {
            headers[key] = params[value];
          });
          requestConfig.headers = headers;
        }
        return requestConfig;
      },
    };
  }

  constructor(config: RequestConfig) {
    this.rootConfig = config;
    this.buildArr = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
      .filter((item) => item.startsWith('builder'))
      .map((item): RequestOptiosHandler => this[item]())
      .sort((o1, o2) => o1.order - o2.order);
  }

  getBuilder(target: any,
    method: string,
    args: any[]): RequestConfig {
    const methodMetaData = MetaData.getMethodMateData(target, method);
    const classMetaData = MetaData.targetConfig.get(target);
    let requestConfig = Object.create(null);
    this.buildArr.forEach((item) => {
      requestConfig = item.handler(methodMetaData, classMetaData, args, requestConfig);
    });
    return requestConfig;
  }
}
