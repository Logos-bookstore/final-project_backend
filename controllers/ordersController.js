import Ordermodel from "../models/Order.js";
import UserModel from "../models/User.js";
import BookModel from "../models/Book.js";
import ReviewModel from "../models/Review.js";

const createOrder = async (req, res, next) => {
    try {
        const order = await Ordermodel.create(req.body.order);
        const user = await UserModel.findByIdAndUpdate(req.user._id, {$push: {orders: order._id}});
        res.json({success: true, message: 'Your order was placed.'});
    } catch (error) {
        next(error);
    }
};

const orderByUser = async (req, res, next) => {
    try {
        const order = await Ordermodel.find({userId: req.user._id}).populate('books', {title: 1, author: 1, price: 1, "image.thumbnail": 1});
        res.json({success: true, data: order});
    } catch (error) {
        next(error);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const booksByOrder = await Ordermodel.findOne({_id: req.params.id}).select({books: 1});
        if(booksByOrder) {
            for(let i = 0; i < booksByOrder.books.length; i++) {
                const reviewByUser = await ReviewModel.findOne({book: booksByOrder.books[i], userId: req.user._id});
                if(reviewByUser) {
                    const deleteReview = await ReviewModel.deleteOne({book: booksByOrder.books[i], userId: req.user._id});
                    const findReviews = await ReviewModel.find({book: booksByOrder.books[i]});
                    let sumRatings = 0;
                    const sumRatingsArray = findReviews.map((item) => (sumRatings += item.rating));
                    const average = sumRatingsArray.at(-1)
                    ? (sumRatingsArray.at(-1) / findReviews.length)
                        .toFixed(1)
                        .replace(/\.0+$/, '')
                    : 0;
                    const findBook = await BookModel.findByIdAndUpdate(booksByOrder.books[i], {avgRating: average, $pull: {reviews: reviewByUser._id}}, {new: true});
                }
            };
        }

        const user = await UserModel.findByIdAndUpdate(req.user._id, {$pull: {orders: req.params.id}}, {new: true});
        await Ordermodel.findByIdAndDelete(req.params.id);
        const order = await Ordermodel.find({userId: req.user._id}).populate('books', {title: 1, author: 1, price: 1, "image.thumbnail": 1});
        res.json({success: true, data: order});
    } catch (error) {
        next(error);
    }
};

const deleteItem = async (req, res, next) => {
    try {
        const reviewByUser = await ReviewModel.findOne({book: req.params.id, userId: req.user._id});
        if(reviewByUser) {
            const deleteReview = await ReviewModel.deleteOne({book: req.params.id, userId: req.user._id});
            const findReviews = await ReviewModel.find({book: req.params.id});
            let sumRatings = 0;
                const sumRatingsArray = findReviews.map((item) => (sumRatings += item.rating));
                const average = sumRatingsArray.at(-1)
                  ? (sumRatingsArray.at(-1) / findReviews.length)
                      .toFixed(1)
                      .replace(/\.0+$/, '')
                  : 0;
                const findBook = await BookModel.findByIdAndUpdate(req.params.id, {avgRating: average, $pull: {reviews: reviewByUser._id}}, {new: true});
        }

        const orderById = await Ordermodel.findOne({_id: req.body.id});
        const index = orderById.books.indexOf(req.params.id);
        const quantity = orderById.quantity[index];
        if(orderById.books.length === 1) {
                    const user = await UserModel.findByIdAndUpdate(req.user._id, {$pull: {orders: req.body.id}}, {new: true});
                    const deleteOrder = await Ordermodel.deleteOne({_id: req.body.id});
        } else {
            const order = await Ordermodel.findByIdAndUpdate(req.body.id, {$pull: {books: req.params.id, quantity: quantity}}, {new: true});
        };
        const order = await Ordermodel.find({userId: req.user._id}).populate('books', {title: 1, author: 1, price: 1, "image.thumbnail": 1});
        res.json({success: true, data: order});
    } catch (error) {
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        const order = await Ordermodel.findOne({_id: req.params.id});

        const index = order.books.indexOf(req.body.book);
        const quantity = order.quantity[index];
        
        const price = await Ordermodel.findOne({_id: req.params.id}).populate('books', {price: 1});

        const priceIndex = price.books[index].price * parseInt(req.body.qty);
        const priceTimesQty = price.books[index].price * quantity;
        const newTotalPrice = parseFloat((order.totalPrice - priceTimesQty + priceIndex).toFixed(2));

        const newQty = parseInt(req.body.qty);

        const updatedOrder = await Ordermodel.findOneAndUpdate({_id: req.params.id}, {$pull: {books: req.body.book, quantity: quantity}}, {new: true});
        const updatedOrder2 = await Ordermodel.findOneAndUpdate({_id: req.params.id}, {$push: {books: req.body.book, quantity: newQty}}, {new: true});
        const updatedOrder3 = await Ordermodel.findOneAndUpdate({_id: req.params.id}, {totalPrice: newTotalPrice}, {new: true});

        const userOrders = await Ordermodel.find({userId: req.user._id}).populate('books', {title: 1, author: 1, price: 1, "image.thumbnail": 1});
        res.json({success: true, data: userOrders});
    } catch (error) {
        next(error);
    }
};

export {createOrder, orderByUser, deleteOrder, deleteItem, updateItem};