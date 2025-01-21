const passport = require('passport');
const jwt = require('jsonwebtoken');

// Middleware pour vérifier le JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware pour vérifier les rôles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Vous n\'avez pas les permissions nécessaires'
      });
    }

    next();
  };
};

// Middleware pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      username: user.username,
      role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
  generateToken
};