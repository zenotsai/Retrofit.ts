import {
  BaseUrl, GET, Query, Path, POST, Body, Header, Head, Headers,
} from '../dist/index';

@BaseUrl('/user')
export default class Person {
  @GET('/getUser/:user.id')
  getUser(@Path('user') user, @Query('name') name) { }

  @POST('/addUser')
  addUser(@Body('username') username) {}

  @POST('/login')
  login(@Header('cookie') cookie) {}
}
