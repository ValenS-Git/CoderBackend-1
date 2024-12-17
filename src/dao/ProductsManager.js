import fs from 'fs/promises';
import { console } from 'inspector';

export class ProductsManager {
    static #path="";

    static setPath(rutaArchivo = ""){
        this.#path=rutaArchivo;
    }

    static async readProducts(){
        if(!this.#path) {
            throw new Error("La ruta del archvio no esta configurada")
        }
        try{
            return JSON.parse(await fs.readFile(this.#path, {encoding:"utf-8"}));
        }catch (error){
            console.error("Error al leer los productos: ", error);
            return [];
        }
    }

    static async writeProducts (products){
        if(!this.#path){
            throw new Error("La ruta del archvio no esta configurada");
        }
        try{
            await fs.writeFile(this.#path, JSON.stringify(products, null, 2));
        }catch (error){
            console.error("Error al escribir productos: ", error);
        }
    };

    static async getProducts(limit){
        const products = await this.readProducts();
        if(limit){
            return products.slice(0, limit);
        }
        return products;
    };

    static async getProductById (pid){
        const products = await this.readProducts();
        return products.find(prod=> prod.id === pid);
    };

    static async createProduct(productData) {
        let products=await this.readProducts();
        let id=1;
        if(products.length>0){
            id=Math.max(...products.map(d=>d.id))+1
        };
        let newProduct={
            id, 
            ...productData
        };
        products.push(newProduct);
        await this.writeProducts(products);
        return newProduct;
    };

    static async updateProduct(pid, updateData){
        const products = await this.readProducts();
        const productIndex = products.findIndex(prod => prod.id === pid);
        if (productIndex !== -1){
            const updatedProduct = {
                ...products[productIndex],
                ...updateData
            };
            products[productIndex]=updatedProduct;
            await this.writeProducts(products);
            return updatedProduct;
        }else{
            throw new Error('Producto no encontrado');
        }
    }
    static async deleteProduct(pid){
        let products = await this.readProducts();
        const productIndex = products.findIndex(prod => prod.id === pid);
        if (productIndex !== -1){
            products = products.filter(prod => prod.id !== pid);
            await this.writeProducts(products);
            return true;
        }
    }
}