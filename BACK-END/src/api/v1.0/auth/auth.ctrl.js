const Joi = require('joi');
const User = require('db/models/User');
const GroupInfo = require('db/models/GroupInfo');
const Admin = require('db/models/Admin');
const MyList = require("db/models/MyList");

// local register function
exports.localRegister = async (ctx) => {
  const { body } = ctx.request;
  let schema = null;
  if (body.familyEmail) {
    schema = Joi.object({
      displayName: Joi.string().regex(/^[a-zA-Z0-9ㄱ-힣]{3,12}$/).required(),
      familyEmail: Joi.string().email(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30)
    });
  } else {
    schema = Joi.object({
      displayName: Joi.string().regex(/^[a-zA-Z0-9ㄱ-힣]{3,12}$/).required(),
      familyEmail: Joi.boolean(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30)
    });
  }

  const result = Joi.validate(body, schema);
  // Schema error 
  if(result.error) {
    ctx.status = 400;
    ctx.body = 'Schema error';
    return;
  }

  const { displayName, email, password, familyEmail } = body;
  try {
    // check email or displayName existancy
    const exists = await User.findExistancy({ email, displayName })
      .catch(e => console.log(`❌  Error occured at User.findByEmail: ${e}`));
    if(exists) {
      ctx.status = 409;
      const key = exists.email === email ? 'email' : 'displayName';
      ctx.body = {
        message: `Already exists [${key}]` 
      };
      return;
    }
    let family = null;
    // 가족정보가 있다면
    if(familyEmail) {
      family = await User.findByEmail(familyEmail);
    }
    // creates user account
    const user = await User.localRegister({
      displayName, email, password, family: family || false
    });

    ctx.body = {
      displayName,
      email,
      _id: user._id,
      familyEmail: familyEmail || false,
      metaInfo: user.metaInfo
    };

    const accessToken = await user.generateToken()
      .catch(error => console.log(error));

    // configure accessToken to httpOnly cookie || 쿠키설정
    ctx.cookies.set('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};

// local login function
exports.localLogin = async (ctx) => {
  const { body } = ctx.request;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(30)
  });

  const result = Joi.validate(body, schema);

  // Schema error 
  if(result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { email, password } = body;
  
  // associate with DB handling 
  try {
    // find user
    const user = await User.findByEmail(email);
    // find admin
    const admin = await Admin.findByUser(user);
    
    if(!user) {
      // user dose not exist
      ctx.status = 409;
      ctx.body = `user[${email}] dose not exist`;
      return;
    }

    const validate = user.validatePassword(password);
    if(!validate) {
      // wrong password..
      ctx.status = 403;
      ctx.body = 'Password is not equal!';
      return;
    }
    
    // access token 을 생성한다.
    const accessToken = await user.generateToken();
    // access_token이라는 이름으로 access token 을 발급한다.
    ctx.cookies.set('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    const { _id, displayName, metaInfo, family: familyId } = user;
    // find family email
    let family = null;
    if(familyId) {
      family = await User.findById(familyId);
    }
    // response message(data)
    ctx.body = {
      loggedInfo: { _id, email, displayName, metaInfo, familyEmail: familyId ? family.email : false },
      adminInfo: admin || {}
    };
  } catch (error) {
    ctx.throw(error);
  }
};

exports.check = async (ctx) => {
  const { user } = ctx.request;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session이 없다면
  if(!user) {
    ctx.status = 403;
    ctx.body = 'Any session not founded!';
    return;
  }
  
  ctx.body = {
    ...user,
    adminInfo: admin
  };
};

// 이메일 / 아이디 존재유무 확인
exports.exists = async (ctx) => {
  // /exists/:key(email|displayName)/:value
  const { key, value } = ctx.params;
  let user = null;

  try {
    // key 에 따라 findByEmail 혹은 findByDisplayName 을 실행합니다.
    user = await (key === 'email' ? User.findByEmail(value) : User.findByDisplayName(value));
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = {
    exists: user !== null
  };
};

// 로그아웃
exports.logout = (ctx) => {
  ctx.cookies.set('access_token', null, {
    maxAge: 0, 
    httpOnly: true
  });
  ctx.status = 204;
};

// Profile Update
exports.updateUser = async (ctx) => {
  const { body } = ctx.request;

  let schema = null;
  if (body.familyEmail) {
    schema = Joi.object({
      displayName: Joi.string().regex(/^[a-zA-Z0-9ㄱ-힣]{3,12}$/).required(),
      familyEmail: Joi.string().email(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30)
    });
  } else {
    schema = Joi.object({
      displayName: Joi.string().regex(/^[a-zA-Z0-9ㄱ-힣]{3,12}$/).required(),
      familyEmail: Joi.boolean(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).max(30)
    });
  }

  const result = Joi.validate(body, schema);
  // Schema error 
  if(result.error) {
    ctx.status = 400;
    ctx.body = 'Schema error';
    return;
  }
  // recieved Client request data
  const { displayName, email, password, familyEmail } = body;
  try {
    const user = await User.findByEmail(email);
    if(!user) {
      // user dose not exist
      ctx.status = 409;
      ctx.body = `user[${email}] dose not exist`;
      return;
    }
    let family = null;
    // 가족정보가 있다면
    if(familyEmail) {
      family = await User.findByEmail(familyEmail);
    }
    // update user data
    await User.updateUser({ displayName, password, email, family: family || false });
    // send data to client
    ctx.body = {
      displayName,
      email,
      _id: user._id,
      familyEmail: familyEmail || false,
      metaInfo: user.metaInfo
    };

    const accessToken = await user.generateToken()
      .catch(error => console.log(error));

    // configure accessToken to httpOnly cookie || 쿠키설정
    ctx.cookies.set('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    });
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};

// admin register function
exports.adminRegister = async (ctx) => {
  const { user, body, file } = ctx.request;

  const schema = Joi.object({
    type: Joi.string().min(2).max(20).required(),
    name: Joi.string().min(2).max(30).required(),
    location: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2).max(30).required(),
    tell: Joi.string().min(2).max(30).required()
  });

  const result = Joi.validate(body, schema);
  // Schema error 
  if(result.error) {
    ctx.status = 400;
    ctx.body = 'Schema error';
    return;
  }

  const { type, name, tell, location, description } = body;
  const role = 'super';

  try {
    // check name or location existancy
    const exists = await GroupInfo.findExistancy({ name, location })
      .catch(e => console.log(`❌  Error occured at GroupInfo.findExistancy: ${e}`));
    if(exists) {
      ctx.status = 409;
      const key = exists.name === name ? 'name' : 'location';
      ctx.body = {
        message: `Already exists [${key}]` 
      };
      return;
    }

    // find user obj
    console.log('user ::: ', user);

    // creates group info
    const group = await GroupInfo.groupRegister({
      type, 
      name, 
      tell, 
      location, 
      description, 
      certification: file ? file.path : null
    });
    // create admin user
    const admin = await Admin.adminRegister({
      role, user, group
    });

    ctx.body = {
      admin
    };
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};

// group register function
exports.groupRegister = async (ctx) => {
  const { user, body } = ctx.request;

  /* 
    Version 2.0에서 개선되어야 함 
    Version 1.0에서는 별도의 데이터를 받지않고 바로 인증/가입 해줍니다.
  */
  // const schema = Joi.object({
  //   name: Joi.string().min(2).max(30).required(),
  //   location: Joi.string().min(2).max(30).required(),
  //   description: Joi.string().min(2).max(30).required(),
  //   tell: Joi.string().min(2).max(30).required()
  // });

  // const result = Joi.validate(body, schema);
  // // Schema error 
  // if(result.error) {
  //   ctx.status = 400;
  //   ctx.body = 'Schema error';
  //   return;
  // }

  const { groupId } = body;

  try {
    // find groupInfo by Id
    const groupInfo = await GroupInfo.findById({ _id: groupId });
    // update group info
    const result = await groupInfo.addMember({
      _id: user._id
    });
    if(!result) {
      // addMember failed
      ctx.status = 409;
      ctx.body = `addMember faild::: group Register faild`;
      return;
    }
    const memberInfo = await groupInfo.memeberValidation({ _id: user._id });
    
    /* group에 memeber로 등록됨과 동시에 즐겨찾기에 그룹추가 */
    // user의 myList
    const mylist = await MyList.findById({ user: user._id });

    // myList가 없으면 새로운 myList를 생성함과 동시에 요청받은 group을 즐겨찾기에 추가한다.
    mylist
      ? await MyList.myListRegister({ user: user._id, group: groupId })
      : await mylist.groupPushRemove({ group: groupId });
    
    ctx.body = {
      memberInfo
    };
  } catch (error) {
    console.log(error);
    ctx.throw(500);
  }
};