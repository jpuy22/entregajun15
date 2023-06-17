const fs = require('fs');

class ProductManager {

    constructor(path) {
        this.path = path;
        this.products = [];
        this.productId = 1;

        try {
            if (!fs.existsSync(this.path)) {
                fs.writeFileSync(this.path, '[]');
            }else{
                const fileData = fs.readFileSync(path, 'utf-8');
                this.products = JSON.parse(fileData);
                if (this.products.length > 0) {
                    const lastProduct = this.products[this.products.length - 1];
                    this.productId = lastProduct.id + 1;
                }
            }
        } catch (error) {
            console.log('Error al leer el archivo:', error);
        }
    }

    saveToFile() {
        try {
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.log('Error al guardar en el archivo:', error);
        }
    }

    addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
            console.log('Error: Todos los campos son obligatorios.');
            return;
        }

        const isHere = this.products.find(p => p.code === product.code);
        if (isHere) {
            console.log('Error: El producto ya existe.');
            return;
        }

        product.id = this.productId++;
        this.products.push(product);
        this.saveToFile();
    }

    getProducts = () =>{
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            console.log('Error: El producto no existe.');
        }
        return product;
    }

    updateProduct = (id, updatedFields) => {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            console.log('Error: Producto no existe.');
            return;
        }

        const product = this.products[productIndex];
        const updatedProduct = { ...product, ...updatedFields };
        this.products[productIndex] = updatedProduct;

        this.saveToFile();
    }

    deleteProduct = (id) => {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            console.log('Error: Producto no existe.');
            return;
        }

        this.products.splice(productIndex, 1);

        this.saveToFile();
    }
}

module.exports = ProductManager;
