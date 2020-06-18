const Router = require('koa-router'); 
const uploader = require('lib/multerUploader');

const auth = new Router();
const authCtrl = require('./auth.ctrl');

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // rejects storing a file
    cb(null, false);
  }
};
// file 업로드를 위함 ( 저장위치 : uploads/ 폴더 )
const upload = uploader.createUploader({ dir: 'uploads/certification', limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

/* /api/v1.0/auth */
auth.get('/', (ctx) => {
  ctx.body = '✅ Welcome to auth!!';
});
auth.post('/register/local', authCtrl.localRegister);
auth.post('/login/local', authCtrl.localLogin);
auth.get('/exists/:key(email|displayName)/:value', authCtrl.exists);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);
// profile 관련
auth.post('/profile', authCtrl.updateUser); // profile update
auth.get('/profile'); // profile Read
// admin 관련
auth.post('/register/admin', upload.single('certification'), authCtrl.adminRegister); // profile update
auth.get('/profile/admin'); // profile Read
// group 관련
auth.post('/register/group', authCtrl.groupRegister);
module.exports = auth;