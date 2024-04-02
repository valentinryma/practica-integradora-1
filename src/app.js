//? ----------------------------------------
// TODO:
// - Cart: Fs / Db Manager 
// - Messages: View message (Hanldebars)
// - Pruebas clase 08.
//? ----------------------------------------

const express = require('express');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');

//* Managers con MoongoDB
const ProductDBManager = require(`${__dirname}/dao/dbManager/productManager.js`);
//! const CartDBManager = require(`${__dirname}/dao/dbManager/cartManager.js`)

//* Managers con FileSystem
// const ProductFileManager = require(`${__dirname}/dao/fileManager/productManager.js`)
// const CartFileManager = require(`${__dirname}/dao/fileManager/cartManager.js`)

const app = express();

// Require Routers
const viewsRouter = require(`${__dirname}/routes/views.js`)
const productsRouter = require(`${__dirname}/routes/products.js`)
const cartsRouter = require(`${__dirname}/routes/carts.js`)

// Config. Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars')

// Config. Express
app.use(express.static(`${__dirname}/../public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const main = async () => {
    // Conexion MoongoDB
    const connectStr = 'mongodb+srv://user:UMDpnTEXC4OoOtSq@cluster0.fl7yeip.mongodb.net/'
    await mongoose.connect(connectStr, {
        dbName: 'ecommerce'
    });

    //* Manager con DB
    const productManager = new ProductDBManager();
    //! const cartManager = new CartDBManager();

    //* Manager con FS
    // const productDB = `${__dirname}/dao/dbFile/products.json`;
    // const cartDB = `${__dirname}/dao/dbFile/carts.json`;
    // const productManager = new ProductFileManager(productDB);
    // const cartManager = new CartFileManager(cartDB, productDB);

    await productManager.prepare();
    //! await cartManager.prepare();

    // Guardamos las instancias de los managers, en `req.app.get(Manager)`
    app.set('productManager', productManager);
    //! app.set('cartManager', cartManager);

    // Server HTTP
    const PORT = process.env.PORT || 8080;
    const serverHTTP = app.listen(PORT, () => {
        console.log('Server: On ✔')
    })
}

main();