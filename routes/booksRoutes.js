import { Router } from 'express';
import { createBook } from '../controllers/booksControllers.js';

const routes = Router();

routes.post('/book', createBook);

export default routes;
