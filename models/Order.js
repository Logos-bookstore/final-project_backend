import { model, Schema } from "mongoose";

const OrderSchema = new Schema({
    date: {type: String, required: true},
    books: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
    quantity: [Number],
    totalPrice: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Ordermodel = model('Order', OrderSchema);

export default Ordermodel;