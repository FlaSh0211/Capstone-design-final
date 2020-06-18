const Router = require('koa-router'); 
const myListCtrl = require('./myList.ctrl');

const myList = new Router();

/* /api/v1.0/mylist */
myList.get('/', myListCtrl.getMyList);

myList.post('/course/active', myListCtrl.activeCourse); 
myList.post('/course/deactive', myListCtrl.deactiveCourse); 
myList.get('/drivers', myListCtrl.getLists); 

myList.post('/groupPushRemove', myListCtrl.groupPushRemove);
myList.post('/coursePushRemove', myListCtrl.coursePushRemove);

module.exports = myList;

module.exports = myList;