const Router = require('koa-router'); 
const searchCtrl = require('./search.ctrl');

const search = new Router();

/* /api/v1.0/search */
search.get('/', (ctx) => {
  ctx.body = '✅ Welcome to myLists!!';
});
// 키워드 검색 searchGroupByQuery
search.get('/group/', searchCtrl.searchGroupByKeywords);

// myList.get('/drivers', searchCtrl.getLists); 

module.exports = search;