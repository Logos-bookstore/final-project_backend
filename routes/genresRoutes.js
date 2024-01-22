import { Router } from 'express';
import { genres, someBook } from '../controllers/genresControllers.js';

const routes = Router();

routes.get('/', genres);
routes.get('/random', someBook);

export default routes;
