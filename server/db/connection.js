// db/connection.js

// 1. Load environment variables immediately
require('dotenv').config();

const mongoose = require('mongoose');
const DB_URI = process.env.DATABASE;

// 2. Fail fast if the URI is missing
if (!DB_URI) {
  console.error('❌  DATABASE environment variable is not set.');
  process.exit(1);
}

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅  MongoDB connection successful.');
  })
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err);
    // 4. Exit so your serverless function or app doesn’t run in a bad state
    process.exit(1);
  });

// 3. Export the mongoose connection for use elsewhere
module.exports = mongoose;
