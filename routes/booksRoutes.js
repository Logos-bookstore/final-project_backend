import { Router } from 'express';
import { createBook, genreBook } from '../controllers/booksControllers.js';
import { authorization } from '../middleware/authorization.js';
import { role } from '../middleware/role.js';

const routes = Router();

routes.post('/book', authorization, role, createBook);
routes.get('/genre', genreBook);

export default routes;
