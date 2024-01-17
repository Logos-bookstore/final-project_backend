import { model, Schema } from 'mongoose';

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  publisher: { type: String, required: true },
  genre: { type: String, required: true },
  description: { type: String, required: true },
  pages: { type: Number, required: true },
  price: { type: Number, required: true },
  ISBN: { type: String, required: true, index: { unique: true } },
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  avgRating: { type: Number, default: 0 },
  image: {
    fileName: { type: String, required: true },
    data: { type: Buffer },
    thumbnail: { type: String, required: true },
  },
});

const BookModel = model('Book', BookSchema);

export default BookModel;
