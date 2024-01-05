import { Router } from 'express';
import {
  addReview,
  deleteReview,
  editReview,
  getAllReviews,
  getReviewsByBookId,
  getReviewsByUserId,
  getSingleReview,
} from '../controllers/reviewsControllers.js';

const routes = Router();

routes.get('/all', getAllReviews);
routes.get('/single/:id', getSingleReview);
routes.get('/one_user/:id', getReviewsByUserId);
routes.get('/one_book/:id', getReviewsByBookId);
routes.post('/new', addReview);
routes.patch('/edit/:id', editReview);
routes.delete('/delete/:id', deleteReview);

export default routes;
