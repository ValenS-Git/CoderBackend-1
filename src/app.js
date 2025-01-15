import express, { json, urlencoded } from 'express';
import { router as productsRouter } from './routes/productsRoutes.js';
import { router as cartsRouter } from './routes/cartsRoutes.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { ProductsManager } from './dao/ProductsManager.js';

const app = express();
const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views','./src/view')

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("./src/public"))

app.get('/', async (req, res) => {
    const products = await ProductsManager.getProducts()
    res.render('home', { products })
});

app.get('/realtimeproducts', async (req, res) => {
    const products = await ProductsManager.getProducts();
    res.render('realTimeProducts', { products });
});
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const serverHTTP = app.listen(PORT, () => {
    console.log(`servidor corriendo en localhost:${PORT}`)
});
const io = new Server(serverHTTP)

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    socket.emit('products', await ProductsManager.getProducts());

    socket.on('createProduct', async (productData) => {
        try {
            const createdProduct = await ProductsManager.createProduct(productData);
            const products = await ProductsManager.getProducts();
            io.emit('products', products)
        } catch (error) {
            console.error('Error al crear el producto ', error)
        }
    })
})

