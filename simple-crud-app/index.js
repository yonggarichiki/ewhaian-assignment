const express = require('express');
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route.js');
const app = express();

// .env 파일 로드 (Node 20.12+)
try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile('.env');
  }
} catch (error) {
  console.log('Could not load .env file:', error.message);
}

// Middleware 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes 설정
app.use('/api/products', productRoute);

app.get('/', (req, res) => {
  res.send("Hello from Node API Server Updated");
});

// MongoDB 연결 및 서버 실행
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log('MONGODB_URI is not set. Please check your .env file.');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Connection failed!", error.message);
  });
