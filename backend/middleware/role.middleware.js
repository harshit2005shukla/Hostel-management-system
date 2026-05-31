export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        status: 'error',
        message: 'Access forbidden. User role identity context is missing.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: `Role access restriction. Your current role '${req.user.role}' is not authorized to execute this operation. Permitted roles: ${allowedRoles.join(', ')}.`
      });
    }

    next();
  };
};
