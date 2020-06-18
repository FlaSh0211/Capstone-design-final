const multer = require('@koa/multer');
const path = require('path');
const fs = require('fs');

// dir: 업로드된 파일을 저장할 경로, limits: 파일을 용량, fileFilter: 파일필터
function createUploader({ dir, limits, fileFilter }) {
  dir = dir || 'uploads';

  fs.readdir(dir, (error) => {
    // uploads 폴더 없으면 생성
    if (error) {
      fs.mkdirSync(dir);
    }
  });
  
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, dir + '/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    }
  });

  const upload = multer({
    storage,
    limits,
    fileFilter
  });

  return upload;
}

exports.createUploader = createUploader;