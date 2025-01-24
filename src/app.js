import express, { json, urlencoded } from 'express';
import { router as productsRouter } from './routes/productsRoutes.js';
import { router as cartsRouter } from './routes/cartsRoutes.js';
import { engine } from 'express-handlebars';
import { viewsRouter } from './routes/views.routes.js';
import { Server } from 'socket.io';
import { ProductsManager } from './dao/ProductsManager.js';

const app = express();
const PORT = 8080;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views')

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("./src/public"))

app.use('/', viewsRouter);

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
    });

    socket.on('deleteProduct', async (code) => {
        try {
            const products = await ProductsManager.readProducts();
            const productIndex = products.findIndex(prod => prod.code === code);

            if (productIndex !== -1) {
                products.splice(productIndex, 1); // Eliminar el producto
                await ProductsManager.writeProducts(products); // Guardar cambios
                io.emit('products', products);  // Enviar lista actualizada a todos los clientes
            } else {
                console.log('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar el producto', error);
        }
    });
})

