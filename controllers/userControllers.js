import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

const register = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.TOKEN_KEY,
      { issuer: 'Zett' }
    );
    res.header('token', token).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      const password = await bcrypt.compare(req.body.password, user.password);
      if (password) {
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          process.env.TOKEN_KEY,
          { issuer: 'Zett' }
        );
        res.header('token', token).json({ success: true, data: user });
      } else {
        res.json({
          success: false,
          message: 'Please make sure your password is correct.',
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Please make sure your email is correct.',
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if(req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await UserModel.findByIdAndUpdate(req.params.id, {password: hashedPassword}, {new: true});
      res.json({success: true, data: user});
    } else {
      const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
      res.json({success: true, data: user});
    };
  } catch (error) {
    next(error);
  }
};

const authorizedUser = (req, res) => {
  res.json({ success: true, data: req.user });
};

export { register, login, updateUser, authorizedUser };
