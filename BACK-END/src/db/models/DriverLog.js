const mongoose = require("mongoose");

const DriverLog = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: [Number],
  },
  locationLog: [],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
DriverLog.index({ location: "2dsphere" });
DriverLog.statics.register = function ({ driverId, name, location }) {
  const driverLog = new this({
    driverId,
    name,
    location: {
      type: "Point",
      coordinates: [location.longitude, location.latitude],
    },
  });
  driverLog.save();
  return driverLog;
};

DriverLog.statics.update = ({ _id, locationLog, location }) => {
  return (
    this.findOneAndUpdate({ _id }, { $addToSet: { locationLog }, location })
      .nModified === 1
  );
};

module.exports = mongoose.model("DriverLog", DriverLog);
