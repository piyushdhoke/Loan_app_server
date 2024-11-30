const jwt = require('jsonwebtoken');
const User = require('../Model/user');

const auth = (requiredRole) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select('-password');
      console.log('User Role:', user.role); 
      if (!user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
      }
      if (requiredRole && user.role !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
      }
      req.user = user;
      next();
    } catch (err) {
      console.error('Auth Middleware Error:', err);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = auth;
