import { Router } from "express";
import { createOrder, deleteItem, deleteOrder, orderByUser, updateItem } from "../controllers/ordersController.js";
import { authorization } from "../middleware/authorization.js";

const routes = Router();

routes.post('/create', authorization, createOrder);
routes.get('/user', authorization, orderByUser);
routes.delete('/del/order/:id', authorization, deleteOrder);
routes.delete('/delete/item/:id', authorization, deleteItem);
routes.patch('/update/:id', authorization, updateItem);

export default routes;