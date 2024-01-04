import BookModel from '../models/Book.js';
import stream from 'stream';

export const streamImage = async (req, res, next) => {
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