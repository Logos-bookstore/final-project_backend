import { Router } from 'express';
import { genres } from '../controllers/genres.js';

const routes = Router();

routes.get('/', genres);

export default routes;
