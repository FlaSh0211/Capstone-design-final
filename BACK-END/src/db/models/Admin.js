const mongoose = require("mongoose");
const { PASSWORD_HASH_KEY: secret } = process.env;
const crypto = require("crypto");
const token = require("lib/token");

// 사용법: console.log(hash('1234'));
const hash = (password) =>
  crypto.createHmac("sha256", secret).update(password).digest("hex");

const Admin = new mongoose.Schema({
  role: String,
  user: {
    // 해당 Admin을 사용하는 User
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  group: {
    // 해당 Admin이 속해있는 AdminGroup정보
    type: mongoose.Schema.Types.ObjectId,
    ref: "GroupInfo",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 유저정보로 어드민 찾기
Admin.statics.findByUser = function (user) {
  return this.findOne({ user });
};

// gorup id로 어드민 찾기
Admin.statics.findById = function ({ _id }) {
  return this.findOne({ _id });
};

// admin 회원가입
Admin.statics.adminRegister = function ({ role, user, group }) {
  const admin = new this({
    role,
    user,
    group,
  });
  admin.save();
  return admin;
};

module.exports = mongoose.model("Admin", Admin);
