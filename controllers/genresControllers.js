import BookModel from '../models/Book.js';
import GenreModel from '../models/Genre.js';

const genres = async (req, res, next) => {
  try {
    const genres = await GenreModel.find();
    res.json({ success: true, data: genres });
  } catch (error) {
    next(error);
  }
};

const someBook = async (req, res, next) => {
  try {
    const count = await BookModel.find().estimatedDocumentCount();
    const random = Math.floor(Math.random() * count) + 1;
    const book = await BookModel.findOne().skip(random).select({title: 1, author: 1, description: 1, avgRating: 1, price: 1, "image.thumbnail": 1});
    res.json({success: true, data: book});
  } catch (error) {
    next(error);
  }
};

export { genres, someBook };
