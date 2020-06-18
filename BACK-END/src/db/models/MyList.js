/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
const mongoose = require('mongoose');

const MyList = new mongoose.Schema({
  user: {
    // 해당 리스트를 사용하는 User
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  groupList: [
    {
      group: {
        // 해당 Admin이 속해있는 AdminGroup정보
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupInfo'
      },
      courses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course'
        }
      ]
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
MyList.statics.myListRegister = function ({ user, group }) {
  const form = group ? {
    group,
    courses: []
  } : {};
  const myList = new this({
    user,
    groupList: form
  });
  myList.save();
  return myList;
};
MyList.statics.findById = function ({ user }) {
  return this.findOne({ user });
};
MyList.methods.groupPushRemove = async function ({ group }) {
  // 현재 유저의 즐겨찾기에 해당 그룹이 존재하는지 여부검사
  const exist = this.groupList.filter((obj) => obj.group == group);
  let copyList = this.groupList;
  let result = null;
  // 즐겨찾기 목록에 해당 그룹이 존재하지 않을 경우
  if (exist.length === 0) {
    // 그룹과 빈 코스를 추가해줌
    copyList.push({ group, courses: [] });
  }
  // 즐겨찾기 목록에 해당 그룹이 존재할 경우
  // copyList에 요청받은 그룹을 제외한 나머지 그룹들의 리스트를 넣어준다
  else {
    copyList = copyList.filter((obj) => obj.group != group);
  }
  // 추가 OR삭제된 내용을 업데이트
  result = await this.updateOne({ groupList: copyList });
  return result;
};
MyList.methods.coursePushRemove = async function ({ group, course }) {
  const exist = this.groupList.filter((obj) => obj.group == group);
  let result = null;
  let copyList = this.groupList;
  // 그룹이 존재하지 않으면 그룹을 먼저 추가해줘야한다.
  if (exist.length === 0) {
    result = '그룹을 먼저 추가해야합니다';
    return result;
  } else {
    copyList.map((obj) => {
      // copyList의 오브젝트중 요청받은 그룹과 같은 것이 있다면
      if (obj.group == group) {
        // 해당 그룹의 코스들 중 요청받은 코스와 같은 것이 있는지 여부를 확인한다
        const exist = obj.courses.filter((courseId) => courseId == course);
        // 같은 것이 있다면 해당 코스를 remove해주고 같은 것이 없다면 해당 코스를 추가해준다.
        exist.length == 0
          ? obj.courses.push(course)
          : obj.courses.remove(course);
      }
      // 수정된 결과를 반환한다.
      return obj;
    });
    // 수정된 결과를 update해준다.
    result = this.updateOne({ groupList: copyList });
    // 업데이트해준 내용을 반환
    return result;
  }
};
module.exports = mongoose.model('MyList', MyList);