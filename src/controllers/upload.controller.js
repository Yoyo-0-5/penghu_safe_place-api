const multer = require('multer');
const { uploadToGCS } = require('../services/gcs.service');

// 設定 Multer (使用記憶體儲存)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 限制上傳大小為 10MB
  },
  fileFilter: (req, file, cb) => {
    // 只允許圖片檔案
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只能上傳圖片檔案'));
    }
  },
}).single('image');

async function handleUpload(req, res) {
  return new Promise((resolve) => {
    upload(req, res, async (err) => {
      // 處理 Multer 錯誤
      if (err instanceof multer.MulterError) {
        if (err.code === 'FILE_TOO_LARGE') {
          return resolve({ statusCode: 400, body: { error: '檔案太大，請上傳小於 10MB 的檔案' } });
        }
        return resolve({ statusCode: 400, body: { error: err.message } });
      } else if (err) {
        return resolve({ statusCode: 400, body: { error: err.message } });
      }

      try {
        if (!req.file) {
          return resolve({ statusCode: 400, body: { error: '沒有選擇任何檔案' } });
        }

        // 上傳至 GCS
        const gcsResult = await uploadToGCS(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype
        );

        console.log(`✅ 成功上傳到 GCS: gs://${gcsResult.bucket}/${gcsResult.fileName}`);

        resolve({
          statusCode: 200,
          body: {
            message: '上傳成功',
            ...gcsResult
          }
        });
      } catch (error) {
        console.error('上傳 GCS 發生錯誤:', error);
        
        if (error.code === 'ENOENT' || (error.message && error.message.includes('GOOGLE_APPLICATION_CREDENTIALS'))) {
          return resolve({
            statusCode: 500,
            body: { 
              error: 'GCS 認證失敗。請確保已設定 GOOGLE_APPLICATION_CREDENTIALS 環境變數。',
              details: error.message 
            }
          });
        }
        
        resolve({
          statusCode: 500,
          body: { 
            error: '伺服器內部錯誤',
            details: error.message
          }
        });
      }
    });
  });
}

module.exports = {
  handleUpload
};
