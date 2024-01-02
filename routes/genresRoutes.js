import { Router } from 'express';
import { genres } from '../controllers/genresControllers.js';

const routes = Router();

routes.get('/', genres);

export default routes;
