//? [ Product Manager - Mongo ]
const ProductModel = require(`${__dirname}/../models/products.js`)

class ProductManager {
    constructor() { }

    async prepare() {
        if (ProductModel.db.readyState !== 1) {
            console.log('DB no conectada...')
            throw Error(`must connect to mongodb!`)
        } else {
            console.log('DB: Ok ✔')
        }
    }

    async getProducts(filters = null) {
        const title = filters && filters.title;
        const category = filters && filters.category;


        const conditions = []

        if (title) {
            conditions.push({
                title: {
                    $regex: `^${title}`,
                    $options: 'i' // Insensitive
                }
            });
        }

        if (category) {
            conditions.push({ category })
        }

        const products = conditions.length
            ? await ProductModel.find({ $and: conditions })
            : await ProductModel.find();

        // Instancias Model -> Object JS | Virtual: true => id ✔
        return products.map(p => p.toObject({ virtuals: true }));
    }

    async getProductById(id) {
        try {
            const productFound = await ProductModel.findOne({ _id: id });
            if (productFound == null) {
                throw new Error('Product not found')
            }
            return productFound

        } catch (error) {
            console.error(error)
            return { error: error.message }
        }
    }

    async addProduct(product) {
        const { title, code, price, status, stock, category, thumbnails } = product
        try {
            const newProduct = await ProductModel.create({ title, code, price, status, stock, category, thumbnails });
            return newProduct;

        } catch (error) {
            console.error(error)
            return { error: error.message }
        }
    }

    async deleteById(id) {
        await ProductModel.deleteOne({ _id: id });
    }
}

module.exports = ProductManager;