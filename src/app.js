import express from 'express';
import { engine } from 'express-handlebars';  
import productsRoutes from './routes/productsRoutes.js';
import cartsRoutes from './routes/cartsRoutes.js';
import viewsRoutes from './routes/views.routes.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

const app = express();

mongoose.connect('mongodb://localhost:27017/shop')
  .then(() => console.log('Base de datos conectada'))
  .catch(err => console.log('Error en la conexión a la base de datos', err));

app.engine('handlebars', engine());  
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);
app.use('/views', viewsRoutes);

app.use(express.static('public'));

const server = app.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Un nuevo cliente se ha conectado');
  
  socket.on('productAdded', (product) => {
    io.emit('productAdded', product);  
  });
  
  socket.on('cartUpdated', (cart) => {
    io.emit('cartUpdated', cart);  
  });
});

