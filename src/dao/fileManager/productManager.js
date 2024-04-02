const fs = require('node:fs');
// const { validateFields } = require(`${__dirname}/../../utils.js`)

class ProductManager {
    #path
    #products

    constructor(filepath) {
        this.#path = filepath;
        this.#products = [];
    }

    async prepare() {
        // Lee el contenido del archivo y carga los productos en un arreglo de la instancia.
        try {
            const fileContent = await fs.promises.readFile(this.#path, 'utf-8');
            const products = JSON.parse(fileContent);
            this.#products = products
        } catch (err) {
            console.error({ error: err.message });
            this.#products = []
        }
    }

    async #updateFile() {
        // Escribe el archivo db, con el contenido del arreglo productos de la instancia.
        await fs.promises.writeFile(
            this.#path,
            JSON.stringify(this.#products, null, 4)
        );
    };

    #getNewId = (array) => {
        return array.length > 0 ? array[array.length - 1].id + 1 : 1
    }

    async getProducts(filters = null) {
        const title = filters && filters.title;
        const category = filters && filters.category;

        console.log(filters)

        const filteredByTitle = title
            ? this.#products.filter(p => p.title.toLowerCase().startsWith(title.toLowerCase()))
            : this.#products;

        const filteredByCategory = category
            ? filteredByTitle.filter(p => p.category.toLowerCase() === category)
            : filteredByTitle;


        return filteredByCategory;
    }

    async deleteById(id) {
        const productIndex = this.#products.findIndex(p => p.id == id);
        if (productIndex == -1) {
            return
        }

        this.#products.splice(productIndex, 1);
        await this.#updateFile();
    };

    async addProcut(product) {
        const { title, code, price, status, stock, category } = product;

        // Corrobrar Datos
        const codeAlreadyStored = this.#products.findIndex(p => p.code === code) >= 0;
        if (!title || !code || !price || !stock || !category || codeAlreadyStored) {
            throw new Error('Invalid Product data');
        }

        const newProduct = {
            ...product,
            id: this.#getNewId(this.#products)
        }

        this.#products.push(newProduct);
        this.#updateFile();
        return newProduct
    };

    async getProductById(id) {
        try {
            const product = this.#products.find(p => p.id == id);
            if (!product) {
                return { error: "Product not Found" }
            }

            return product
        } catch (err) {
            console.error(err);
            return { error: "Error in getProductById" };
        }
    }
}

module.exports = ProductManager;