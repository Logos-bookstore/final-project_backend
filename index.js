import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import morgan from 'morgan';
import { database } from './database/database.js';
import books from './routes/books.js';
import genres from './routes/genres.js';

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(cors({ origin: `${process.env.HOST}`, exposedHeaders: ['token'] }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./views/public'));
app.use(fileUpload());
app.use(morgan('tiny'));

database();

app.use('/api/books', books);
app.use('/api/genres', genres);

app.listen(PORT, () => console.log('the server is running on port', PORT));
