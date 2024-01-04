import BookModel from '../models/Book.js';
import ReviewModel from '../models/Review.js';
import UserModel from '../models/User.js';

export const getAllReviews = async (req, res, next) => {
  try {
    const showReviews = await ReviewModel.find()
      .populate('book', 'title -_id')
      .populate('userId', 'firstName' /* , email */);

    res.send({ success: true, data: showReviews });
  } catch (error) {
    next(error);
  }
};

// do we need this one?
export const getSingleReview = async (req, res, next) => {
  try {
    const showOneReview = await ReviewModel.findById(req.params.id)
      .populate('book', 'title')
      .populate('userId', 'firstName');

    res.send({ success: true, data: showOneReview });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByUserId = async (req, res, next) => {
  try {
    const getReviews = await ReviewModel.find({
      userId: req.params.id,
    }).populate('userId', 'email');

    res.send({ success: true, data: getReviews });
  } catch (error) {
    next(error);
  }
};

export const getReviewsByBookId = async (req, res, next) => {
  try {
    const getReviews = await ReviewModel.find({ book: req.params.id }).populate(
      'userId',
      'email'
    );

    res.send({ success: true, data: getReviews });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const createReview = await ReviewModel.create(req.body);
    const updateUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { reviews: createReview._id } },
      { new: true }
    );
    const updateBook = await BookModel.findByIdAndUpdate(
      req.body.book,
      { $push: { reviews: createReview._id } },
      { new: true }
    );

    res.send({ success: true, data: createReview });
  } catch (error) {
    next(error);
  }
};

export const editReview = async (req, res, next) => {
  try {
    const updateReview = await ReviewModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.send({ success: true, data: updateReview });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const handleDelete = await ReviewModel.findByIdAndDelete(req.params.id);

    const updateUser = await UserModel.findByIdAndDelete(req.params.id, {
      $pull: { reviews: req.params.id },
    });

    const updateBook = await BookModel.findByIdAndDelete(req.params.id, {
      $pull: { reviews: req.params.id },
    });

    res.send({ success: true, message: 'review deleted' });
  } catch (error) {
    next(error);
  }
};
