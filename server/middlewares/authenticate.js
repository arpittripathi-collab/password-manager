// middlewares/authenticate.js

const jwt = require('jsonwebtoken');
const User = require('../models/schema');

const authenticate = async (req, res, next) => {
  try {
    // 1) Try cookie first:
    let token = req.cookies?.jwtoken;

    // 2) Fallback to Authorization header:
    if (!token) {
      const authHeader = req.headers.authorization || '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
      }
    }

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // 3) Verify signature & extract payload
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    // 4) Lookup user + token in DB
    const rootUser = await User.findOne({
      _id: payload._id,
      'tokens.token': token
    });

    if (!rootUser) {
      return res.status(401).json({ error: 'User not found' });
    }

    // 5) Attach to req and proceed
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;
    next();

  } catch (err) {
    console.error('Auth Error:', err.message);
    return res.status(401).json({ error: 'Unauthorized user.' });
  }
};

module.exports = authenticate;
