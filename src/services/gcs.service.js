const { Storage } = require('@google-cloud/storage');
const path = require('path');

// 1. 初始化 GCS 客戶端
const storage = new Storage({
  keyFilename: path.join(__dirname, '../../gcs-api-496205-7584d2897819.json'),
});
const GCS_BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'my-report-image'; // GCS Bucket 名稱
const bucket = storage.bucket(GCS_BUCKET_NAME);

async function uploadToGCS(fileBuffer, originalName, mimeType) {
  const fileExtension = path.extname(originalName);
  const fileNameWithoutExt = path.basename(originalName, fileExtension);
  const destFileName = `images/${Date.now()}_${fileNameWithoutExt}${fileExtension}`;
  
  const file = bucket.file(destFileName);

  // 將記憶體中的檔案 (Buffer) 直接儲存到 GCS
  await file.save(fileBuffer, {
    contentType: mimeType, // 設定正確的 Content-Type
    resumable: false // 針對小檔案設為 false 可加快上傳速度
  });

  return {
    fileName: destFileName,
    bucket: GCS_BUCKET_NAME,
    gcsPath: `gs://${GCS_BUCKET_NAME}/${destFileName}`
  };
}

module.exports = {
  uploadToGCS,
  getBucketName: () => GCS_BUCKET_NAME
};
