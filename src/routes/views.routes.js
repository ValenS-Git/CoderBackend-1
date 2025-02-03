import { Router } from 'express';
import ProductsManager from '../dao/ProductsManager.js';
import CartsManager from '../dao/CartsManager.js';

const router = Router();

const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

router.get('/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, query = '', sort = '' } = req.query;

        const products = await productsManager.getAll({
            page: parseInt(page),
            limit: parseInt(limit),
            query,
            sort
        });

        res.render('realtimeproducts', {
            status: 'success',
            payload: products.products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.prevLink,
            nextLink: products.nextLink
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;

        const product = await productsManager.getById(pid);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        res.render('productDetail', { product });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).send('Error al obtener el producto');
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;

        const cart = await cartsManager.getById(cid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }

        res.render('cartDetail', { cart });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).send('Error al obtener el carrito');
    }
});

export default router;

