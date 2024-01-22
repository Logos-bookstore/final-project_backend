import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
import ReviewModel from "../models/Review.js";
import BookModel from "../models/Book.js";
import OrderModel from "../models/Order.js";

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
      { issuer: "Zett" }
    );
    res.header("token", token).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select({"image.fileName": 0, "image.data": 0});
    if (user) {
      const password = await bcrypt.compare(req.body.password, user.password);
      if (password) {
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          process.env.TOKEN_KEY,
          { issuer: "Zett" }
        );
        res.header("token", token).json({ success: true, data: user });
      } else {
        res.json({
          success: false,
          message: "Please make sure your password is correct.",
        });
      }
    } else {
      res.json({
        success: false,
        message: "Please make sure your email is correct.",
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    if (req.body?.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { password: hashedPassword },
        { new: true }
      ).select({ "image.fileName": 0, "image.data": 0 });
      res.json({ success: true, data: user });
    } else if (req.files?.image?.name) {
      const fileName = Date.now() + "_" + req.files.image.name;
      const data = {
        fileName: fileName,
        data: req.files.image.data,
        thumbnail: `${process.env.PROFILE_IMAGE}${fileName}`,
      };
      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        { image: data },
        { new: true }
      ).select({ "image.fileName": 0, "image.data": 0 });
      res.json({ success: true, data: user });
    } else {
      const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      }).select({ "image.fileName": 0, "image.data": 0 });
      res.json({ success: true, data: user });
    }
  } catch (error) {
    next(error);
  }
};

const authorizedUser = (req, res) => {
  res.json({ success: true, data: req.user });
};

const deleteUserById = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const userReviews = await ReviewModel.find({userId: userId});
    const deletedReviews = await ReviewModel.deleteMany({userId: userId});

      // delete the references in the User & Book collections:
      if(userReviews) {
        for(let i = 0; i < userReviews.length; i++) {
        // update the average rating of the book
        const findReviews = await ReviewModel.find({book: userReviews[i].book});
        let sumRatings = 0;
        const sumRatingsArray = findReviews.map((i) => (sumRatings += i.rating));
        const average = sumRatingsArray.at(-1)
          ? (sumRatingsArray.at(-1) / findReviews.length)
              .toFixed(1)
              .replace(/\.0+$/, '')
          : 0;

          const findBook = await BookModel.findByIdAndUpdate(userReviews[i].book, {avgRating: average, $pull: {reviews: userReviews[i]._id}}, {new: true});
        };
      };

    const deletedOrders = await OrderModel.deleteMany({userId: userId});
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { register, login, updateUser, authorizedUser, deleteUserById };
