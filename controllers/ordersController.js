import Ordermodel from "../models/Order.js";
import UserModel from "../models/User.js";

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

export {createOrder, orderByUser};