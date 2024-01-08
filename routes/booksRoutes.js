import { Router } from 'express';
import {
  createBook,
  genreBook,
  getAllBooks,
} from '../controllers/booksControllers.js';
import { streamBookImage } from '../controllers/imageController.js';
import { authorization } from '../middleware/authorization.js';
import { role } from '../middleware/role.js';

const routes = Router();

routes.post('/book', authorization, role, createBook);
routes.post('/genre', genreBook);
routes.get('/all', getAllBooks);
routes.get('/image/:fileName', streamBookImage);

export default routes;
