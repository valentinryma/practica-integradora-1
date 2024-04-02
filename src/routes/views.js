const { Router } = require('express');
const router = Router();

router.get('/', async (req, res) => {
    const productManager = req.app.get('productManager');

    res.render('index', {
        title: 'Product Manager',
        products: await productManager.getProducts(),
        script: [
            'index.js'
        ]
    });
});

module.exports = router;