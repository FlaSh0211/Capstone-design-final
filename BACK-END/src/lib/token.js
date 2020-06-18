const jwt = require('jsonwebtoken');
const { JET_SECRET: secret } = process.env;

/* 
  특정정보(payload)를 담은 token을 생성해줍니다. 
  ==> 추후에 이 토큰을 해석해 payload를 얻습니다.
*/
function generateToken(payload, subject) {
  return new Promise(
    (resolve, reject) => {
      jwt.sign(payload, secret, {
        issuer: 'wherecar.com',
        expiresIn: '7d',
        subject
      }, (error, token) => {
        if(error) reject(error);
        resolve(token);
      });
    }
  );
}

// token을 해석하는 func
function decodeToken(token) {
  return new Promise(
    (resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if(error) reject(error);
        resolve(decoded);
      });
    }
  );
}

exports.generateToken = generateToken;
exports.decodeToken = decodeToken;