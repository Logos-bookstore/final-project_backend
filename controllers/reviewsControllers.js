import BookModel from '../models/Book.js';
import ReviewModel from '../models/Review.js';
import UserModel from '../models/User.js';

export const getAllReviews = async (req, res, next) => {
  try {
    const showReviews = await ReviewModel.find()
      .populate('book', 'title -_id')
      .populate('userId', 'firstName');
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
      userId: req.user._id,
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
      'firstName'
    );
    res.send({ success: true, data: getReviews });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    if (!req.body.rating) {
      res.send({
        success: false,
        message: 'Please choose your rating from 1-5',
      });
    }

    const createReview = await ReviewModel.create(req.body);
    const updateUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $push: { reviews: createReview._id } },
      { new: true }
    );

    // update the average rating of the book:
    const findReviews = await ReviewModel.find({ book: req.body.book });
    let sumRatings = 0;
    const sumRatingsArray = findReviews.map((i) => (sumRatings += i.rating));
    const average = sumRatingsArray.at(-1)
      ? (sumRatingsArray.at(-1) / findReviews.length)
          .toFixed(1)
          .replace(/\.0+$/, '')
      : 0;

    const updateBook = await BookModel.findByIdAndUpdate(
      req.body.book,
      { avgRating: average, $push: { reviews: createReview._id } },
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

    // update the average rating of the book:
    const bookId = updateReview.book;
    const findReviews = await ReviewModel.find({ book: bookId });
    let sumRatings = 0;
    const sumRatingsArray = findReviews.map((i) => (sumRatings += i.rating));
    const average = sumRatingsArray.at(-1)
      ? (sumRatingsArray.at(-1) / findReviews.length)
          .toFixed(1)
          .replace(/\.0+$/, '')
      : 0;

    const updateBook = await BookModel.findByIdAndUpdate(
      bookId,
      { avgRating: average },
      { new: true }
    );

    res.send({ success: true, data: updateReview });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const findReview = await ReviewModel.findById(req.params.id);
    const bookId = findReview.book;
    const removeReview = await ReviewModel.findByIdAndDelete(req.params.id);

    // update the average rating of the book
    // why isn't reduce working here ??
    const findReviews = await ReviewModel.find({ book: bookId });
    let sumRatings = 0;
    const sumRatingsArray = findReviews.map((i) => (sumRatings += i.rating));
    const average = sumRatingsArray.at(-1)
      ? (sumRatingsArray.at(-1) / findReviews.length)
          .toFixed(1)
          .replace(/\.0+$/, '')
      : 0;

    // delete the references in the User & Book collections:
    const updateBook = await BookModel.findByIdAndUpdate(
      bookId,
      { avgRating: average, $pull: { reviews: req.params.id } },
      { new: true }
    );

    const updateUser = await UserModel.updateOne(
      //
      { reviews: req.params.id },
      {
        $pull: { reviews: req.params.id },
      }
    );

    res.send({ success: true, message: 'review deleted' });
  } catch (error) {
    next(error);
  }
};
