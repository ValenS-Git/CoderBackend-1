// dao/CartsManager.js
import Cart from './models/Cart.js';

class CartsManager {
  constructor() {}

  async getCartById(cid) {
    try {
      const cart = await Cart.findById(cid).populate('products.product');
      if (!cart) {
        return { status: 'error', message: 'Cart not found' };
      }
      return { status: 'success', payload: cart };
    } catch (error) {
      console.error(error);
      return { status: 'error', message: error.message };
    }
  }

  async updateCart(cid, products) {
    try {
      const cart = await Cart.findByIdAndUpdate(cid, { products }, { new: true });
      return { status: 'success', payload: cart };
    } catch (error) {
      console.error(error);
      return { status: 'error', message: error.message };
    }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        return { status: 'error', message: 'Cart not found' };
      }

      cart.products = cart.products.filter(product => product.product.toString() !== pid); 
      await cart.save();

      return { status: 'success', payload: cart };
    } catch (error) {
      console.error(error);
      return { status: 'error', message: error.message };
    }
  }

  async deleteAllProductsFromCart(cid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        return { status: 'error', message: 'Cart not found' };
      }

      cart.products = []; 
      await cart.save();

      return { status: 'success', payload: cart };
    } catch (error) {
      console.error(error);
      return { status: 'error', message: error.message };
    }
  }
}

export default CartsManager;

