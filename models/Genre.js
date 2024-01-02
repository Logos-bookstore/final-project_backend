import { model, Schema } from 'mongoose';

const GenreSchema = new Schema({
  genre: { type: String, required: true },
});

const GenreModel = model('Genre', GenreSchema);

export default GenreModel;
