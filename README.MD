# Retrofit.js

基于注解实现的HTTP请求库，可作为Java[Retrofit](https://github.com/square/retrofit)的TypeScript版本的实现


##  使用者指南
** 目前只支持TypeScript环境 **

** npm i Retrofit.js --save
## 使用示例
```javaScript
import
    Retrofit,
    {
      ReftrofitResponse, BaseUrl, GET, Query, Path, POST, Body, Header, Head, Headers,
    }
from 'Retrofit.js';
@BaseUrl('/user')
class Person {
  @GET('/getUser/:user.id')
  getUser(@Path('user') user): Promise<ReftrofitResponse> & void { }

  @POST('/addUser')
  addUser(@Body('username') username): Promise<ReftrofitResponse> & void { }

  @POST('/login')
  login(@Header('cookie') cookie): Promise<ReftrofitResponse> & void { }
}

let retrofit = new Retrofit.Builder()
  .baseUrl('http://localhost:3007')
  .build();
  
// 发起请求
let call = retrofit.create<Person>(Person);
call.getUser({
  id: 1
}).then(() => {

}).catch(() => {

})
```
## 拦截器
- 实现Interceptor接口的handler方法即可
- 分为请求拦截器和响应拦截器
- 请求拦截器中，handler的参数和返回值为RequestConfig， 响应拦截器为ReftrofitResponse
- handler方法如果不返回话，会终止后续拦截器的执行
```javaScript
class LoggerInterceptor implements Interceptor {
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
    console.log('config  ', context);
    console.log(`curl -X ${context.method}  '${context.baseURL}${context.url}'  ${header}`);
    return context;
  }
}
let retrofit = new Retrofit.Builder()
  .baseUrl('http://localhost:3007')
  .addReqInterceptor(new LoggerInterceptor())
  .build();
```
## :star: 目前支持的注解
方法层级
- GET (path: string)
- POST (path: string)
- PUT (path: string)
- Del (path: string)
- HEAD (path: string)
- PATCH (path: string)
- Path (key: string)
- Query (key: string)
- Header (key: string) // 定义某个请求的header
- Head (key: string)   // 为某个请求的header填充值

class层级
- BaseUrl (path: string)
- Headers (header: string[])

