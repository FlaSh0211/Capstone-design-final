const Router = require('koa-router'); 
const uploader = require('lib/multerUploader');

const admin = new Router();
const adminCtrl = require('./admin.ctrl');

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    // rejects storing a file
    cb(null, false);
  }
};
// file 업로드를 위함 ( 저장위치 : uploads/ 폴더 )
const upload = uploader.createUploader({ dir: 'uploads/car', limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });

/* /api/v1.0/admin */
admin.get('/', (ctx) => {
  ctx.body = '✅ Welcome to admin!!';
});
/* =======assoicate member of group======= */
// 그룹에 속한 유저들 확인하기
admin.get('/users', adminCtrl.groupUsers);

// 그룹에 속한 매니저들 확인하기
admin.get('/managers', adminCtrl.groupManagers);

// 매니저권한 새로부여 및 수정
admin.post('/managers', adminCtrl.updateManagers);

/* =======assoicate car of group======= */
// 자동차 등록 
admin.post('/car/register', upload.single('carImage'), adminCtrl.carRegister);

// 자동차 수정
admin.put('/car', upload.single('carImage'), adminCtrl.carUpdate);

// 자동차 삭제 
admin.delete('/car/:id', adminCtrl.carDelete);

// 아이디로 자동차 가져오기
admin.get('/cars/:id', adminCtrl.getCars);

// 그룹 아이디로 자동차리스트 가져오기
admin.get('/car/:id', adminCtrl.getCar);

/* =======assoicate course of group======= */
// 경로 생성 
admin.post('/course', adminCtrl.courseRegister);

// 경로 업데이트 
admin.put('/course', adminCtrl.courseUpdate);

// 경로 삭제 
admin.delete('/course/:id', adminCtrl.courseDelete);

// 경로들 받아오기 
admin.get('/courses/:id', adminCtrl.getCoursesByGroup);

// 경로 받아오기 
admin.get('/course/:id', adminCtrl.getCourseById);


module.exports = admin;