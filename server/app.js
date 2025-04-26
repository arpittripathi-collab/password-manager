// server/app.js

// 1) Load env vars immediately:
require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// 2) CORS configuration
const FRONTEND = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({
  origin: [FRONTEND, 'https://password-manager-eight-xi.vercel.app'],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  credentials: true
}));

// 3) Cookie parser
app.use(cookieParser());

// 4) Connect to MongoDB
require('./db/connection');

// 5) Body parser
app.use(express.json());

// 6) Mount routers
//    - Auth routes (login, register)
app.use('/auth', require('./router/auth'));
//    - Vault & user routes
app.use('/api', require('./router/routing'));

// 7) 404 handler
app.use((req, res) =>
  res.status(404).json({ error: 'Route not found' })
);

// 8) Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 9) Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
