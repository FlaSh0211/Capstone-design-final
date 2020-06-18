const Joi = require('joi');
const Course = require('db/models/Course');
const MyList = require("db/models/MyList");
const fs = require('fs');

const dummyLists = [
  {
    id: 0,
    driverName: '홍길동1',
    routes: [
      { locationName: '1', Latitude: '0', longitude: '0' },
      { locationName: '2', Latitude: '0', longitude: '0' },
      { locationName: '3', Latitude: '0', longitude: '0' }
    ],
    currentLoc: { Latitude: '0', longitude: '0' }
  },
  {
    id: 1,
    driverName: '홍길동2',
    routes: [
      { locationName: '1', Latitude: '0', longitude: '0' },
      { locationName: '2', Latitude: '0', longitude: '0' },
      { locationName: '3', Latitude: '0', longitude: '0' }
    ],
    currentLoc: { Latitude: '0', longitude: '0' }
  },
  {
    id: 5,
    driverName: '홍길동5',
    routes: [
      { locationName: '1', Latitude: '0', longitude: '0' },
      { locationName: '2', Latitude: '0', longitude: '0' },
      { locationName: '3', Latitude: '0', longitude: '0' }
    ],
    currentLoc: { Latitude: '0', longitude: '0' }
  }
];

exports.getLists = (ctx) => {
  ctx.body = {
    driverList: dummyLists
  };
};

exports.activeCourse = async (ctx) => {
  const { user, body } = ctx.request;
  // user session또는 관리자 권한이 없다면
  if(!user) {
    ctx.status = 403;
    ctx.body = 'Any session not founded!';
    // eslint-disable-next-line no-useless-return
    return;
  };

  // body에서 받은정보 validation하기
  const schema = Joi.object({
    carId: Joi.string(),
    courseId: Joi.string()
  });

  const result = Joi.validate(body, schema);
  // Schema error 
  if(result.error) {
    console.log('🔥Schema error', result.error);
    ctx.status = 400;
    ctx.body = 'Schema error';
    // eslint-disable-next-line no-useless-return
    return;
  }

  // recieved Client request data
  const { carId, courseId } = body;
  try {
    const result = await Course.activeCourse({
      _id: courseId,
      carId,
      userId: user._id
    });
    console.log("=======", result)
    // response message(=data)
    ctx.body = result.ok === 1;
  } catch (error) {
    ctx.throw(error);
  }
};

exports.deactiveCourse = async (ctx) => {
  const { user, body } = ctx.request;
  // user session또는 관리자 권한이 없다면
  if(!user) {
    ctx.status = 403;
    ctx.body = 'Any session not founded!';
    // eslint-disable-next-line no-useless-return
    return;
  };

  // body에서 받은정보 validation하기
  const schema = Joi.object({
    courseId: Joi.string()
  });

  const result = Joi.validate(body, schema);
  // Schema error 
  if(result.error) {
    console.log('🔥Schema error', result.error);
    ctx.status = 400;
    ctx.body = 'Schema error';
    // eslint-disable-next-line no-useless-return
    return;
  }

  // recieved Client request data
  const { courseId } = body;
  try {
    const result = await Course.deactiveCourse({
      _id: courseId
    });
    // response message(=data)
    ctx.body = result;
  } catch (error) {
    ctx.throw(error);
  }
};

exports.getMyList = async (ctx) => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403;
    ctx.body = 'Any session not founded!';
    return;
  }
  try {
    let mylist = await MyList.findById({ user: user._id });
    mylist = mylist || await MyList.myListRegister({ user: user._id });
    
    ctx.body = {
      user: user._id,
      mylist
    };
  } catch (e) {
    ctx.throw(e);
  }
};
exports.groupPushRemove = async (ctx) => {
  const { body, user } = ctx.request;
  const { groupId } = body;
  // console.log(groupId);
  if (!user) {
    ctx.status = 403;
    ctx.body = 'Any session not founded!';
    return;
  }
  try {
    // user의 myList
    let mylist = await MyList.findById({ user: user._id });
    let result = null;
    // myList가 없으면 새로운 myList를 생성함과 동시에 요청받은 group을 즐겨찾기에 추가한다.
    if (!mylist) {
      result = await MyList.myListRegister({ user: user._id, group: groupId });
    }
    // myList가 존재하면 요청받은 그룹을 추가 OR 삭제한다
    else {
      result = await mylist.groupPushRemove({ group: groupId });
    }
    // 결과를 전송한다.
    ctx.body = result;
  } catch (e) {
    ctx.throw(e);
  }
};
exports.coursePushRemove = async (ctx) => {
  const { body, user } = ctx.request;
  const { courseId, groupId } = body;
  // console.log(courseId, groupId);
  if (!user) {
    ctx.status = 403;
    ctx.body = 'Any session not founded!';
    return;
  }
  try {
    // user의 myList를 받아옴
    const mylist = await MyList.findById({ user: user._id });
    // 요청받은 코스를 수정 OR 삭제한다.
    const result = await mylist.coursePushRemove({
      group: groupId,
      course: courseId
    });
    ctx.body = result;
  } catch (e) {
    ctx.throw(e);
  }
};