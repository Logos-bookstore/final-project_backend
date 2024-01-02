import { Router } from 'express';
import {
  authorizedUser,
  login,
  register,
} from '../controllers/userControllers.js';
import { validation } from '../middleware/validation.js';
import { authorization } from '../middleware/authorization.js';

const routes = Router();

routes.post('/register', validation, register);
routes.post('/login', /* authorizatin,  */ login);

routes.get('/verifytoken', authorization, authorizedUser);

export default routes;
