import { Interceptor, RequestConfig } from '../interfaces';

export default class LoggerInterceptor implements Interceptor {
  handler(context: RequestConfig): RequestConfig {
    let header = '';
    if (context.headers) {
      const headerKeys: string[] = Object.keys(context.headers);
      if (headerKeys.length > 0) {
        headerKeys.forEach((key: string) => {
          header = header.concat(` -H '${key}: ${context.headers[key]}'`);
        });
      }
    }
    console.log('config11  ', context);
    console.log(`curl -X ${context.method}  '${context.baseURL}${context.url}'  ${header}`);
    return context;
  }
}
