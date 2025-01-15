import { Router } from 'express';
import { ProductsManager } from '../dao/ProductsManager.js';

export const router = Router();

ProductsManager.setPath("./src/data/products.json");

router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await ProductsManager.getProducts(parseInt(limit));
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await ProductsManager.getProductById(parseInt(pid));
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };
    try {
        const createdProduct = await ProductsManager.createProduct(newProduct);

        res.status(201).json(createdProduct);
    } catch (error) {
        if (error.message === 'Ya existe un producto con el mismo codigo') {
            res.status(400).json({ error: 'Ya existe un producto con el mismo codigo' })
        } else {
            res.status(500).json({ error: 'Error al crear el producto' });
        }
    }
});

router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const updatedData = req.body;

    try {
        const updatedProduct = await ProductsManager.updateProduct(parseInt(pid), updatedData);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const result = await ProductsManager.deleteProduct(parseInt(pid));
        if (result) {
            res.json({ message: `Producto ${req.params.pid} eliminado` })
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto;' })
    }
});