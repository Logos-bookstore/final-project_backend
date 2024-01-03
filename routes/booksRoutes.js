import { Router } from 'express';
import { createBook, genreBook } from '../controllers/booksControllers.js';

const routes = Router();

routes.post('/book', createBook);
routes.get('/genre', genreBook);

export default routes;
