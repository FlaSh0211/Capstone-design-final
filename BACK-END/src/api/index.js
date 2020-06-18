const Router = require('koa-router');
const send = require('koa-send'); 
// Version 관리 1.0
const versions = {
  'v1.0': require('./v1.0')
};

const api = new Router();
/* /api/... */
api.use('/v1.0', versions['v1.0'].routes());
// api.get('/uploads/:file', ctx => {
//   ctx.type
// });
module.exports = api;

// 업로드된 이미지 제공하기
api.get('/uploads/:fileurl', async (ctx, next) => {
  const { fileurl } = ctx.params;
  await send(ctx, './uploads/' + fileurl);
});
// 업로드된 이미지 제공하기
api.get('/uploads/car/:fileurl', async (ctx, next) => {
  const { fileurl } = ctx.params;
  console.log(fileurl);
  await send(ctx, './uploads/car/' + fileurl);
});
// 업로드된 이미지 제공하기
api.get('/uploads/certification/:fileurl', async (ctx, next) => {
  const { fileurl } = ctx.params;
  console.log(fileurl);
  await send(ctx, './uploads/certification/' + fileurl);
});