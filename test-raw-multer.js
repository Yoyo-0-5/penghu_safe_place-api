const http = require('http');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = upload.single('image');

const server = http.createServer((req, res) => {
  if (req.method === 'POST') {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        res.statusCode = 500;
        res.end(err.message);
        return;
      }
      if (!req.file) {
        res.statusCode = 400;
        res.end('No file');
        return;
      }
      res.statusCode = 200;
      res.end('OK: ' + req.file.originalname);
    });
  } else {
    res.statusCode = 200;
    res.end('Send POST');
  }
});
server.listen(3001, () => {
  console.log('Listening on 3001');
});
