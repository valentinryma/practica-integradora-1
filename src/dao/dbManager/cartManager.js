// Importamos los Modelo Carts y Products 
const CartModel = require(`${__dirname}/../models/carts.js`);
const ProductModel = require(`${__dirname}/../models/products.js`);

// Creamos la Clase del Cart Manager
class CartManager {
    constructor() { }

    // Verifica que se haya establecido la conexion con Mongo
    async prepare() {
        if (CartModel.db.readyState !== 1) {
            throw new Error('must connect to MongoDB!');
        }
    };

    async getCart() {
        // Obtenemos todos los Documentos de la Coleción "Carts"
        const products = await CartModel.find();

        // Mapeamos todos los docuemntos a objetos JS
        return products.map(p => p.toObject({ virtuals: true }));
    };

    async getCartById(id) {
        try {
            const cartFound = await CartModel.findOne({ _id: id });
            if (cartFound == null) {
                throw new Error('Product not found');
            }
            return cartFound;
        } catch (error) {
            console.error(error);
            return { error: error.message }
        }
    }

    async addCart() {
        try {
            const newCart = await CartModel.create({ products: [] });
            return newCart;
        } catch (error) {
            console.error(error);
            return { error: error.message }
        }
    }

    async addProductCart(cid, product) {
        // cid, { pid, quantity }
        // 312s12q344, { 312a833b91f4, 5}
        const pid = product.pid;
        const quantity = +product.quantity;
        try {
            // Verifica que exista el carrito
            const cartFound = await CartModel.findOne({ _id: cid });
            if (cartFound == null) {
                throw new Error('Cart not found');
            }

            // Verifica que exista el producto
            const productFound = await ProductModel.findOne({ _id: pid })
            if (productFound == null) {
                throw new Error('Product not found')
            }

            // Agregar el producto
            const cartUpdate = await CartModel.findByIdAndUpdate(cid, {
                products: [{ _id: pid, quantity }]
            });
            return cartUpdate;
        } catch (error) {
            console.error(error);
            return { error: error.message }
        }
    }

    async deleteById(id) {
        await CartModel.deleteOne({ _id: id });
    }
}

module.exports = CartManager;