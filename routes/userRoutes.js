import { Router } from 'express';
import {
  authorizedUser,
  login,
  register,
  updateUser,
} from '../controllers/userControllers.js';
import { validation } from '../middleware/validation.js';
import { authorization } from '../middleware/authorization.js';
import { streamProfileImage } from '../controllers/imageController.js';

const routes = Router();

routes.post('/register', validation, register);
routes.post('/login', login);
routes.patch('/update/:id', authorization, updateUser);
routes.get('/image/:fileName', streamProfileImage);

routes.get('/verifytoken', authorization, authorizedUser);

export default routes;
