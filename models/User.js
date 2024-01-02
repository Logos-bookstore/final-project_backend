import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  address: {
    street: String,
    zip: String,
    city: String,
    country: String,
  },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  image: {
    fileName: String,
    data: { type: Buffer },
    thumbnail: String,
  },
});

const UserModel = model('User', UserSchema);

export default UserModel;
