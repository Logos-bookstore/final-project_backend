import { Router } from 'express';
import {
  createBook,
  genreBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
  searchBook,
  hello,
} from '../controllers/booksControllers.js';
import { streamBookImage } from '../controllers/imageController.js';
import { authorization } from '../middleware/authorization.js';
import { role } from '../middleware/role.js';

const routes = Router();

routes.post('/book', authorization, role, createBook);
routes.post('/genre', genreBook);
routes.get('/all', getAllBooks);
routes.get('/:id', getBookById);
routes.get('/image/:fileName', streamBookImage);
routes.get('/search/:regex', searchBook);
routes.patch('/update/:id', authorization, role, updateBook);
routes.delete('/delete/:id', authorization, role, deleteBook);
routes.get('/hello', hello);

export default routes;
