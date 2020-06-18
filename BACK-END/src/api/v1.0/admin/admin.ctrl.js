const Joi = require("joi");
const User = require("db/models/User");
const GroupInfo = require("db/models/GroupInfo");
const CarInfo = require("db/models/CarInfo");
const Course = require("db/models/Course");
const Admin = require("db/models/Admin");
const Station = require("db/models/Station");
const fs = require("fs");

// 그룹에 속한 유저들 정보가져오기, 그룹에 대한 관리자권한만 접근
exports.groupUsers = async (ctx) => {
  const { user } = ctx.request;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session또는 관리자 권한이 없다면
  if (!user || !admin) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }
  // GroupInfo DB에서 유저들정보 가져오기.
  try {
    const group = await GroupInfo.findOne({ _id: admin.group });
    ctx.body = {
      groupUsers: group.users,
      admin: admin,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 그룹에 속해있는 매니저들 찾아오기.
exports.groupManagers = async (ctx) => {
  const { user } = ctx.request;

  try {
    // find admin
    const admin = await Admin.findByUser(user);
    // find GroupInfo
    const groupInfo = await GroupInfo.findOne({ _id: admin.group });
    // user session또는 관리자 권한이 없다면
    if (!user || !admin) {
      ctx.status = 403;
      ctx.body = "Any session not founded!";
      // eslint-disable-next-line no-useless-return
      return;
    }
    // response message(=data)
    ctx.body = {
      Users: await User.findByIds(groupInfo.users),
      Drivers: await User.findByIds(groupInfo.drivers),
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 그룹원들 역할 수정하기 찾아오기.
exports.updateManagers = async (ctx) => {
  const { user, body } = ctx.request;
  try {
    // find admin
    const admin = await Admin.findByUser(user);
    // user session또는 관리자 권한이 없다면
    if (!user || !admin) {
      ctx.status = 403;
      ctx.body = "Any session not founded!";
      // eslint-disable-next-line no-useless-return
      return;
    }
    // find GroupInfo
    const groupInfo = await GroupInfo.findOne({ _id: admin.group });

    let { users, drivers } = groupInfo;
    const { Users, Drivers } = body;

    const beforeMembers = Users.concat(Drivers);
    for (const i in body) {
      if (i === "Users") {
        const rest = users.filter(
          (value) => beforeMembers.indexOf(value) !== -1
        );
        users = [...rest, ...body[i]];
      } else {
        const rest = drivers.filter(
          (value) => beforeMembers.indexOf(value) !== -1
        );
        drivers = [...rest, ...body[i]];
      }
    }
    // update query 날리기
    await GroupInfo.updateManagers({ _id: groupInfo._id, users, drivers });
    // response message(=data)
    ctx.body = {
      managers: {
        Users: groupInfo.users,
        Drivers: groupInfo.drivers,
      },
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 그룹에 속해있는 드라이버 찾아오기.
exports.groupDrivers = async (ctx) => {
  const { user } = ctx.request;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session또는 관리자 권한이 없다면
  if (!user || !admin) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }
  try {
  } catch (error) {
    ctx.throw(error);
  }
};

// 특정그룹에서 자동차 등록하기
exports.carRegister = async (ctx) => {
  // const { user, body } = ctx.request;
  const { user, body, file } = ctx.request;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session또는 관리자 권한이 없다면
  if (!user || !admin) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }

  // body에서 받은정보 validation하기
  const schema = Joi.object({
    carName: Joi.string().min(2).max(30).required(),
    carNumber: Joi.string().min(4).max(30),
    seatNumber: Joi.number(),
    inspectionDate: Joi.date(),
  });

  const result = Joi.validate(body, schema);
  // Schema error
  if (result.error) {
    console.log("🔥Schema error", result.error);
    ctx.status = 400;
    ctx.body = "Schema error";
    // eslint-disable-next-line no-useless-return
    return;
  }
  // recieved Client request data
  const { carName, carNumber, seatNumber, inspectionDate } = body;
  try {
    const carInfo = await CarInfo.carRegister({
      carName,
      carNumber,
      seatNumber,
      inspectionDate,
      carImageUrl: file ? file.path : null,
      group: admin.group,
    });
    // response message(=data)
    ctx.body = {
      carInfo,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 특정그룹의 특정자동차 업데이트하기
exports.carUpdate = async (ctx) => {
  const { user, body, file } = ctx.request;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session또는 관리자 권한이 없다면
  if (!user || !admin) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }

  // body에서 받은정보 validation하기
  const schema = Joi.object({
    carId: Joi.string(),
    carName: Joi.string().min(2).max(30).required(),
    carNumber: Joi.string().min(4).max(30),
    seatNumber: Joi.number(),
    inspectionDate: Joi.date(),
  });

  const result = Joi.validate(body, schema);
  // Schema error
  if (result.error) {
    console.log("🔥Schema error", result.error);
    ctx.status = 400;
    ctx.body = "Schema error";
    // eslint-disable-next-line no-useless-return
    return;
  }
  // recieved Client request data
  const { carId, carName, carNumber, seatNumber, inspectionDate } = body;
  try {
    const car = await CarInfo.findsById({ _id: carId });

    if (file) {
      // if user send a new imageFile
      await fs.stat(car.carImageUrl, function (err) {
        if (!err) {
          // if file or directory exists
          console.log("file or directory exists");

          fs.unlink("./" + car.carImageUrl, function (err) {
            // delete file
            if (err) throw ctx.throw(err);
            console.log("file deleted");
          });
        } else if (err.code === "ENOENT") {
          console.log("file or directory does not exist");
        }
      });
    }

    const carInfo = await car.updateOne({
      carName,
      carNumber,
      seatNumber,
      inspectionDate,
      carImageUrl: file ? file.path : car.carImageUrl,
    });

    ctx.body = {
      // response message(=data)
      carInfo,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 특정그룹의 특정자동차 삭제하기
exports.carDelete = async (ctx) => {
  const { user } = ctx.request;
  const { id } = ctx.params;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session또는 관리자 권한이 없다면
  if (!user || !admin) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }
  try {
    const result = await CarInfo.removeById({ _id: id });
    // response message(=data)
    ctx.body = {
      result,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 그룹에 속해있는 자동차들 가져오기
exports.getCars = async (ctx) => {
  const { user } = ctx.request;
  const { id } = ctx.params;

  // user session이 없다면
  if (!user) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }
  // GroupInfo DB에서 유저들정보 가져오기.
  try {
    // find GroupInfo
    const groupInfo = await GroupInfo.findOne({ _id: id });
    // find Car List
    const carList = await CarInfo.findsByGroup({ group: id });
    ctx.body = {
      groupInfo,
      carList,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 자동차 id로 자동차정보 가져오기
exports.getCar = async (ctx) => {
  const { user } = ctx.request;
  const { id } = ctx.params;

  // user session이 없다면
  if (!user) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }
  // GroupInfo DB에서 유저들정보 가져오기.
  try {
    // find Car List
    const car = await CarInfo.findOne({ _id: id });
    ctx.body = {
      car,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 특정그룹에서 운전코스 등록하기
exports.courseRegister = async (ctx) => {
  const { user, body } = ctx.request;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session또는 관리자 권한이 없다면
  if (!user || !admin) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }

  // body에서 받은정보 validation하기
  const schema = Joi.object({
    courseName: Joi.string().min(2).max(30).required(),
    stations: Joi.array().items(
      Joi.object({
        stationName: Joi.string(),
        longitude: Joi.number(),
        latitude: Joi.number(),
      })
    ),
  });

  const result = Joi.validate(body, schema);
  // Schema error
  if (result.error) {
    console.log("🔥Schema error", result.error);
    ctx.status = 400;
    ctx.body = "Schema error";
    // eslint-disable-next-line no-useless-return
    return;
  }
  // recieved Client request data
  const { courseName, stations } = body;
  try {
    const courseInfo = await Course.courseRegister({
      courseName,
      stations,
      group: admin.group,
    });
    // 각 station 등록하기
    const stationObjs = await Station.registerStations({
      stations,
      courseId: courseInfo._id,
    });
    // response message(=data)
    ctx.body = {
      courseInfo,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 특정그룹에서 운전코스 수정하기
exports.courseUpdate = async (ctx) => {
  const { user, body } = ctx.request;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session또는 관리자 권한이 없다면
  if (!user || !admin) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }

  // body에서 받은정보 validation하기
  const schema = Joi.object({
    courseId: Joi.string(),
    courseName: Joi.string().min(2).max(30).required(),
    stations: Joi.array().items(
      Joi.object({
        stationName: Joi.string(),
        longitude: Joi.number(),
        latitude: Joi.number(),
      })
    ),
  });

  const result = Joi.validate(body, schema);
  // Schema error
  if (result.error) {
    console.log("🔥Schema error", result.error);
    ctx.status = 400;
    ctx.body = "Schema error";
    // eslint-disable-next-line no-useless-return
    return;
  }
  // recieved Client request data
  const { courseName, stations, courseId } = body;
  try {
    const courseInfo = await Course.courseUpdateById({
      _id: courseId,
      courseName,
      stations,
    });
    // response message(=data)
    ctx.body = {
      courseInfo,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 특정그룹에서 운전코스 삭제하기.
exports.courseDelete = async (ctx) => {
  const { user } = ctx.request;
  const { id } = ctx.params;
  // find admin
  const admin = await Admin.findByUser(user);
  // user session또는 관리자 권한이 없다면
  if (!user || !admin) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }
  try {
    const result = await Course.removeById({ _id: id });
    // response message(=data)
    ctx.body = {
      result,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 코스id를 이용하여 코스 찾아오기.
exports.getCourseById = async (ctx) => {
  const { user } = ctx.request;
  const { id } = ctx.params;
  // find admin
  const admin = await Admin.findByUser(user);
  const course = await Course.findById({ _id: id });
  // find GroupInfo
  const groupInfo = await GroupInfo.findOne({ _id: course.group });
  // 디폴트로 관리자로 식별
  let memberInfo = {
    role: "super",
    userId: user._id,
    groupInfoId: id,
  };
  // 관리자가 아니라면
  if (!admin) {
    // 특정그룹에 특정유저가 속해있는지 확인
    memberInfo = groupInfo.memeberValidation({ _id: user._id });
  }
  // user session이 없다면
  if (!user) {
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }
  try {
    // response message(=data)
    ctx.body = {
      course,
      memberInfo,
    };
  } catch (error) {
    ctx.throw(error);
  }
};

// 그룹id를 이용하여 코스들 찾아오기.
exports.getCoursesByGroup = async (ctx) => {
  const { user } = ctx.request;
  const { id } = ctx.params;
  // find admin
  const admin = await Admin.findByUser(user);
  // find GroupInfo
  const groupInfo = await GroupInfo.findOne({ _id: id });
  // 디폴트로 관리자로 식별
  let memberInfo = {
    role: "super",
    userId: user._id,
    groupInfoId: id,
  };
  // 관리자가 아니라면
  if (!admin) {
    // 특정그룹에 특정유저가 속해있는지 확인
    memberInfo = groupInfo.memeberValidation({ _id: user._id });
  }
  // user session또는 그룹에 소속이 안되어 있다면
  if (!user || !memberInfo) {
    console.log("에러발생");
    ctx.status = 403;
    ctx.body = "Any session not founded!";
    // eslint-disable-next-line no-useless-return
    return;
  }
  try {
    const result = await Course.findsByGroup({ group: groupInfo });
    // response message(=data)
    ctx.body = {
      groupInfo,
      memberInfo,
      courseList: result,
    };
  } catch (error) {
    ctx.throw(error);
  }
};
