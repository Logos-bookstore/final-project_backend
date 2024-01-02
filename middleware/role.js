export const role = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json('You are unauthorized.');
  }
};
