import { Router } from 'express';
import { ProductsManager } from '../dao/ProductsManager.js';

export const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    try {
        const products = await ProductsManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar la página de inicio' });
    }
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await ProductsManager.getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).json({ error: 'Error al cargar los productos en tiempo real' });
    }
});