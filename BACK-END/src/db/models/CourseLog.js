const mongoose = require("mongoose");

const CourseLog = new mongoose.Schema({
  driverLog: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DriverLog",
    },
  ],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
CourseLog.statics.register = function ({ courseId }) {
  const courseLog = new this({
    driverLog: [],
    courseId,
  });
  courseLog.save();
  return courseLog;
};
//
CourseLog.statics.update = ({ _id, driverLog }) => {
  return (
    this.findOneAndUpdate({ _id }, { $addToSet: { driverLog } }).nModified === 1
  );
};

module.exports = mongoose.model("CourseLog", CourseLog);
