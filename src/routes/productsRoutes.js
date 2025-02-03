import express from 'express';
import ProductsManager from '../dao/ProductsManager.js';

const router = express.Router();
const productsManager = new ProductsManager();

router.get('/', async (req, res) => {
    const { limit, page, sort, query } = req.query;

    try {
        const result = await productsManager.getAll({
            limit,
            page,
            sort,
            query,
        });

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productsManager.getById(id);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;

