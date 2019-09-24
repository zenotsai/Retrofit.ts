import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as Router from 'koa-router';
import * as koaCors from 'koa-cors';
import { BaseContext } from 'koa';

const app = new Koa();
app.use(koaCors());
app.use(bodyParser());
const router = new Router();
router.del('/user/delUser/:id', async (ctx: BaseContext, next) => {
  ctx.body = ctx.params.id;
});
router.get('/user/getUser/:id', async (ctx: BaseContext, next) => {
  console.log('ctx.request', ctx.request);
  ctx.body = ctx.request.query.name;
});
router.post('/user/addUser', async (ctx: BaseContext, next) => {
  ctx.body = ctx.request.body.username;
});
router.post('/user/login', async (ctx: BaseContext, next) => {
  ctx.body = ctx.request;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3007, () => {
  console.log('start service prot 3007');
});
