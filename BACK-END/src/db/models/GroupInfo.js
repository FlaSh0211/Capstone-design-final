/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
const mongoose = require('mongoose');
const { PASSWORD_HASH_KEY: secret } = process.env;
const crypto = require('crypto');
const token = require('lib/token');

// 사용법: console.log(hash('1234'));
const hash = (password) => crypto.createHmac('sha256', secret).update(password).digest('hex');

const GroupInfo = new mongoose.Schema({
  type: String,
  name: {
    type: String,
    index: true
  },
  tell: {
    type: String,
    index: true
  },
  location: {
    type: String,
    index: true
  },
  description: {
    type: String,
    index: true
  },
  certification: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  users: [ // Group에 속해있는 User들
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  drivers: [ // Group에 속해있는 User들
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

GroupInfo.statics.findById = function({ _id }) {
  return this.findOne({ _id });
};

// 이름과 위치로 그룹 검색하기.
GroupInfo.statics.findExistancy = function({ name, location }) {
  return this.findOne({
    $or: [
      { name },
      { location }
    ]
  });
};

// group 회원가입
GroupInfo.statics.groupRegister = function({ type, name, tell, location, description, certification }) {
  const group = new this({
    type,
    name,
    tell,
    location,
    description,
    certification
  });
  group.save();
  return group;
}; 

GroupInfo.statics.updateManagers = async function({ _id, users, drivers }) {
  return this.update({ _id }, { $set: { users, drivers } });
};
// 여러개의 키워드로 검색합니다.(유사문장검색) /?keywords=01040247797+asdasdasd
GroupInfo.statics.searchGroupByPattern = async function({ keywords }) {
  const keywordsList = keywords.split(' ');
  let list = [];
  for(const i in keywordsList) {
    list.push(
      { name: { $regex: keywordsList[i] } }
    );
    list.push(
      { tell: { $regex: keywordsList[i] } }
    );
    list.push(
      { location: { $regex: keywordsList[i] } }
    );
  }
  let results = await this.find(
    {
      $or: list
    }
  ).select('_id name tell location description');
  
  return results;
};
// 하나의 키워드로 검색합니다.(문장일치검색) /?keyword=asdasdasd
GroupInfo.statics.searchGroupByKeyword = async function({ keyword }) {
  const result = await this.find(
    {
      $text: {
        $search: keyword
      }
    },
    {
      score: {
        $meta: 'textScore'
      }
    }
  ).sort({ score: { $meta: 'textScore' } });

  return result;
};

// methods
GroupInfo.methods.memeberValidation = function({ _id }) {
  const result = {
    role: '',
    userId: '',
    groupInfoId: this._id
  };
  const userCheck = this.users.filter(userId => userId == _id);
  const driverCheck = this.drivers.filter(userId => userId == _id);
  if(userCheck.length !== 0) {
    return {
      ...result,
      role: 'user',
      userId: _id
    };
  }else if(driverCheck.length !== 0) {
    return {
      ...result,
      role: 'driver',
      userId: _id
    };
  } else {
    return {
      ...result,
      role: 'none',
      userId: _id
    };
  }
};
GroupInfo.methods.addMember = function({ _id }) {
  let result = this.update({
    $addToSet: {
      users: _id,
      driver: _id
    }
  });
  return result;
};
module.exports = mongoose.model('GroupInfo', GroupInfo);