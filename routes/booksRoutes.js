import { Router } from 'express';
import { createBook } from '../controllers/booksControllers.js';
import { authorization } from '../middleware/authorization.js';
import { role } from '../middleware/role.js';

const routes = Router();

routes.post('/book', authorization, role, createBook);

export default routes;
