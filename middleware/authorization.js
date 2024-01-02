import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

export const authorization = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const payload = jwt.verify(token, process.env.TOKEN_KEY);
    if (payload) {
      const user = await UserModel.findById(payload._id);
      req.user = user;
      next();
    }
  } catch (error) {
    next(error);
  }
};
