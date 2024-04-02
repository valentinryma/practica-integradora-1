const { Router } = require('express');
const router = Router();

const cManager = 'cartManager';

router.get('/', async (req, res) => {
    try {
        const cartManager = req.app.get(cManager);
        const carts = await cartManager.getCart();

        res.json(carts);
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const cartManager = req.app.get(cManager);
        const cart = await cartManager.getCartById(req.params.id);

        res.json(cart);
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false });
    }
})

router.post('/', async (req, res) => {
    try {
        const cartManager = req.app.get(cManager);
        const cart = await cartManager.addCart();

        res.json(cart);
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false });
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cid = +req.params.cid;
    const productId = +req.params.pid;
    const quantity = +req.body.quantity;

    if (productId < 0 || isNaN(productId)) {
        res.status(400)
            .json({ error: "Product not found" })
    }

    try {
        const cartManager = req.app.get(cManager);
        const cart = await cartManager.addProductCart(cid, {
            productId,
            quantity
        });

        res.json(cart);
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false });
    }
})


module.exports = router