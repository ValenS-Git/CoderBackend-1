import fs from 'fs/promises';

export class CartsManager{
    static #path = "";

    static setPath(rutaArchivo = ""){
        this.#path = rutaArchivo;
    }

    static async readCarts(){
        try {
            return JSON.parse(await fs.readFile(this.#path, {encoding: 'utf-8'}));
        }catch (error){
            console.error('Error al leer el carrito: '. error);
            return [];
        }
    }
    static async writeCarts(carts){
        try{
            await fs.writeFile(this.#path, JSON.stringify(carts, null, 2));
        }catch(error){
            console.error('Error al conseguir carrito: ', error);
        }
    }
    static async createCart(){
        const carts = await this.readCarts();
        const newCart = {
            id: carts.length > 0 ? Math.max(...carts.map(cart => cart.id))+1 : 1,
            products: []
        }
        carts.push(newCart);
        await this.writeCarts(carts);
        return newCart;
    }

    static async getCartById(cid){
        const carts = await this.readCarts();
        return carts.find(cart => cart.id === parseInt(cid));
    }

    static async addProductToCart(cid, pid, quantity){
        const carts = await this.readCarts();
        const cart = carts.find(cart => cart.id === parseInt(cid));
        if(!cart){
            throw new Error('Carrito no encontrado');
        }

        const products = await this.readProducts();
        const product = products.find(p => p.id === parseInt(pid))

        if(!product) {
            throw new Error('Producto no encontrado')
        }
        const productIndex = cart.products.findIndex(p => p.product === parseInt(pid));
        if(productIndex !== -1){
            cart.products[productIndex].quantity += quantity;
        }else{
            cart.products.push({product: parseInt(pid), quantity});
        }
        await this.writeCarts(carts);
        return cart.products;
    }
}