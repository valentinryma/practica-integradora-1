//? [ Cart Rotuer ]
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

// TODO: Error al crear agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    try {
        // Obtenemos una instancia del Cart Manager
        const cartManager = req.app.get(cManager);

        const cart = await cartManager.addProductCart(cid, { pid, quantity });
        res.json({ success: true, cart: cart });
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false });
    }
})

router.delete('/:cid', async (req, res) => {
    const cartManager = req.app.get(cManager);
    const cid = req.params.cid;

    try {
        const cart = await cartManager.deleteById(cid);
        res.json({ success: true, cartDeleted: cart });
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false })
    }
})


module.exports = router