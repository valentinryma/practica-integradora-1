const fs = require('node:fs');

class CartManager {
    #path
    #productsPath

    #products
    #carts

    constructor(filepath, productFilepath) {
        this.#path = filepath;
        this.#productsPath = productFilepath;

        this.#products = [];
        this.#carts = [];


    };

    async prepare() {
        try {
            // Lee el contenido del archivo carrito y carga los carritos en un arreglo de la instancia.
            const fileContent = await fs.promises.readFile(this.#path, 'utf-8');
            const carts = JSON.parse(fileContent);
            this.#carts = carts

            // Lee el contenido del archivo productos y carga los productos en un arreglo de la instancia.
            const ProductsFileContent = await fs.promises.readFile(this.#productsPath, 'utf-8');
            const products = JSON.parse(ProductsFileContent);
            this.#products = products

        } catch (err) {
            console.error({ error: err.message });
            this.#carts = []
            this.#products = []
        }
    }

    async #updateFile() {
        // Escribe el archivo db, con el contenido del arreglo productos de la instancia.
        await fs.promises.writeFile(
            this.#path,
            JSON.stringify(this.#carts, null, 4)
        );
    };

    #getNewId = (array) => {
        return array.length > 0 ? array[array.length - 1].id + 1 : 1
    };

    async getCart() {
        return this.#carts;
    }

    async getCartById(id) {
        try {
            const cart = this.#carts.find(p => p.id == id);
            if (!cart) {
                return { error: "Cart not Found" }
            }

            return cart
        } catch (err) {
            console.error(err);
            return { error: "Error in getCartById" };
        }
    }

    async addCart() {
        // Crea un carrito vacio
        try {
            const newCart = {
                id: this.#getNewId(this.#carts),
                products: []
            };

            this.#carts.push(newCart);
            this.#updateFile();

            return newCart;
        } catch (error) {
            console.error(error);
            return { error: "Error in addCart" };
        };
    };

    async addProductCart(cid, productToAdd) {
        try {
            const cartIndex = this.#carts.findIndex(c => c.id == cid);
            if (cartIndex == -1) {
                return { error: "Cart not found" }
            }

            const product = this.#products.find(p => p.id == productToAdd.productId);

            if (!product) {
                return { error: "Product not Found" }
            }

            let flag = 1
            this.#carts[cartIndex].products.forEach(p => {
                if (p.productId === productToAdd.productId) {
                    p.quantity += productToAdd.quantity || 1;

                    flag = 0;
                }
            });

            if (flag) {
                if (isNaN(productToAdd.quantity)) {
                    productToAdd.quantity = 1;
                }
                this.#carts[cartIndex].products.push(productToAdd);
            }

            this.#updateFile();

            return this.#carts[cartIndex];
        } catch (error) {
            console.error(error);
            return { error: error.message }
        }
    }
}

module.exports = CartManager;