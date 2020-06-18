const mongoose = require("mongoose");

const Course = new mongoose.Schema({
  courseName: String,
  stations: [
    // Group에 속해있는 User들
    {
      type: mongoose.Schema.Types.Map,
      of: mongoose.Schema.Types.String,
    },
  ],
  group: {
    // 해당 Admin이 속해있는 AdminGroup정보
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupInfo",
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarInfo",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// car register 회원가입
Course.statics.courseRegister = function ({ courseName, stations, group }) {
  const course = new this({
    courseName,
    stations,
    group,
  });
  course.save();
  return course;
};

Course.statics.courseUpdateById = async function ({
  _id,
  courseName,
  stations,
}) {
  return this.updateOne({ _id }, { courseName, stations });
};
// Course.statics.findGroupId = function ({ _id }) {
//   return this.findOne({ _id });
// };

Course.statics.removeById = function ({ _id }) {
  return this.deleteOne({ _id });
};
Course.statics.findById = function ({ _id }) {
  return this.findOne({ _id });
};
Course.statics.findsByGroup = function ({ group }) {
  return this.find({ group });
};

Course.statics.activeCourse = function ({ _id, userId, carId }) {
  return this.updateOne({ _id }, { driver: userId, car: carId });
};

Course.statics.deactiveCourse = function ({ _id }) {
  return this.updateOne({ _id }, { driver: null, car: null });
};

module.exports = mongoose.model("Course", Course);
