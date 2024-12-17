import { Router } from 'express';
import {CartsManager} from '../dao/CartsManager.js';

export const router = Router();

CartsManager.setPath('./src/data/carts.json');

router.post('/', async (req, res) => {
    try{
        const newCart = await CartsManager.createCart();
        res.status(201).json(newCart);
    }catch(error){
        res.status(500).json({error: 'Error al crear el carrito'});
    }
});

router.get('/:cid', async (req,res) => {
    try{
        const cart = await CartsManager.getCartById(req.params.cid);
        if(!cart){
            return res.status(404).json('Carrito no encontrado');
        }
        res.json(cart.products);
    }catch(error){
        res.status(500).json({error: 'Error al obtener el carrito'});
    }
})

router.post('/:cid/product/:pid', async (req,res) => {
    try {
        const {quantity = 1 } = req.body;
        const updatedProducts = await CartsManager.addProductToCart(req.params.cid, req.params.pid, quantity);
        res.status(201).json(updatedProducts);
    } catch (error) {
        res.status(500).json({error: 'Error al agregar el producto al carrito'});
    }
})