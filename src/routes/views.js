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

router.get('/chat', async (_, res) => {
    res.render('chat', {
        title: 'Chat',
        useWS: true,
        useSweetAlert: true,
        scripts: [
            'chat.js'
        ],
        styles: [
            'style.css'
        ]
    })
})

module.exports = router;