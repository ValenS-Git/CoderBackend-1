import express, { json, urlencoded } from 'express';
import {router as productsRouter} from './routes/productsRoutes.js';
import {router as cartsRouter} from './routes/cartsRoutes.js';

const app = express();
const PORT = 8080;

app.use(json());
app.use(urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send('Hola mundo');
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const server = app.listen(PORT, () => {
    console.log(`servidor corriendo en localhost:${PORT}`)
});