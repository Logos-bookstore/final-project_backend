import { Router } from "express";
import { createOrder, orderByUser } from "../controllers/ordersController.js";
import { authorization } from "../middleware/authorization.js";

const routes = Router();

routes.post('/create', authorization, createOrder);
routes.get('/user', authorization, orderByUser);

export default routes;