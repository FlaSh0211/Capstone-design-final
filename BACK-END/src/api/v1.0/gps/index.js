const Router = require('koa-router'); 

const gps = new Router();

/* /api/v1.0/auth */
gps.get('/', (ctx) => {
  ctx.body = '✅ Welcome to gps!!';
});

module.exports = gps;