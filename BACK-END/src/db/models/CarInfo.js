const mongoose = require('mongoose');

const CarInfo = new mongoose.Schema({
  carName: String,
  carNumber: String,
  seatNumber: String,
  inspectionDate: Date,
  carImageUrl: String,
  group: { // 해당 Admin이 속해있는 AdminGroup정보
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GroupInfo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// car register 회원가입
CarInfo.statics.carRegister = function({ carName, carNumber, seatNumber, inspectionDate, carImageUrl, group }) {
  const carInfo = new this({
    carName,
    carNumber,
    seatNumber,
    inspectionDate,
    carImageUrl,
    group
  });
  carInfo.save();
  return carInfo;
}; 

CarInfo.statics.carUpdate = async function({ _id, carName, carNumber, seatNumber, inspectionDate, carImageUrl }) {
  return this.update({ _id }, { carName, carNumber, seatNumber, inspectionDate, carImageUrl });
};

CarInfo.statics.removeById = function({ _id }) {
  return this.deleteOne({ _id });
};

CarInfo.statics.findsByGroup = function({ group }) {
  return this.find({ group });
};

CarInfo.statics.findsById = function({ _id }) {
  return this.findOne({ _id });
};

module.exports = mongoose.model('CarInfo', CarInfo);