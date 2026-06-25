const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const UPLOAD_PATH = process.env.UPLOAD_PATH || './uploads';

// Ensure upload directories exist
['profiles', 'foods', 'categories'].forEach((dir) => {
  const full = path.join(UPLOAD_PATH, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

function createStorage(subfolder) {
  return multer.diskStorage({
    destination(req, file, cb) {
      cb(null, path.join(UPLOAD_PATH, subfolder));
    },
    filename(req, file, cb) {
      const ext  = path.extname(file.originalname).toLowerCase();
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });
}

function fileFilter(req, file, cb) {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const extOk   = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk  = allowed.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Only image files are allowed (jpg, jpeg, png, webp, gif)'));
}

const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5 MB

const uploadProfile = multer({
  storage:  createStorage('profiles'),
  fileFilter,
  limits: { fileSize: maxSize },
}).single('profileImage');

const uploadFood = multer({
  storage:  createStorage('foods'),
  fileFilter,
  limits: { fileSize: maxSize },
}).single('image');

module.exports = { uploadProfile, uploadFood };
