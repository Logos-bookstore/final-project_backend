import GenreModel from '../models/Genre.js';

const genres = async (req, res, next) => {
  try {
    const genres = await GenreModel.find();
    res.json({ success: true, data: genres });
  } catch (error) {
    next(error);
  }
};

export { genres };
