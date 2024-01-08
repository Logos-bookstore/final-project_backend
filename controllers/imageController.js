import BookModel from '../models/Book.js';
import stream from 'stream';
import UserModel from '../models/User.js';

export const streamBookImage = async (req, res, next) => {
    try {
        const book = await BookModel.findOne({'image.fileName': req.params.fileName}); //.select({'image.data': 1});
        if(book) {
            const ReadStream = stream.Readable.from(book.image.data);
            ReadStream.pipe(res);
        }
    } catch (error) {
        next(error);
    }
};

export const streamProfileImage = async (req, res, next) => {
    try {
        const profile = await UserModel.findOne({'image.fileName': req.params.fileName});
        if(profile) {
            const ReadStream = stream.Readable.from(profile.image.data);
            ReadStream.pipe(res);
        }
    } catch (error) {
        next(error);
    }
};