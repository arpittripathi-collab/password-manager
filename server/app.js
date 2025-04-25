const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authenticate = require('./middlewares/authenticate'); // import middleware

const app = express();

// Set up environment variables
dotenv.config({ path: './config.env' });

// Middleware
app.use(cookieParser());
app.use(cors({
  credentials: true,  // Allow credentials (cookies)
  origin: 'https://password-manager-six-lemon.vercel.app' // Allow frontend origin
}));

// Parse JSON bodies
app.use(express.json());

// Use Routes
const authRoutes = require('./router/auth');
app.use(authRoutes); // attach routes

// Authentication Protected Route Example
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: "You have access to this protected route!", user: req.rootUser });
});

// Server listening
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
