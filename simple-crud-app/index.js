const express = require('express');
const mongoose = require('mongoose');
const productRoute = require('./routes/product.route.js');
const memberRoute = require('./routes/member.route.js');
const feedbackRoute = require('./routes/feedback.route.js');
const { notFound, errorHandler } = require('./middleware/error.middleware.js');
const app = express();

try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile('.env');
  }
} catch (error) {
  console.log('Could not load .env file:', error.message);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/products', productRoute);
app.use('/api/members', memberRoute);
app.use('/api/feedbacks', feedbackRoute);

app.get('/', (req, res) => {
  res.send('Hello from Node API Server Updated');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.log('MONGODB_URI is not set. Please check your .env file.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to database!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('Connection failed!', error.message);
  });
