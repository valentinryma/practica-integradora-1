const { Router } = require('express');
const router = Router();

const manager = 'productManager'

router.get('/', async (req, res) => {
    try {
        const productManager = req.app.get(manager);
        const products = await productManager.getProducts(req.query);

        res.json(products);
    } catch (error) {
        console.error(error)
        return res.status(400).json({ success: false });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const productManager = req.app.get(manager);
        const product = await productManager.getProductById(req.params.id);

        res.json(product);

    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const productManager = req.app.get(manager);
        const newProduct = await productManager.addProduct(req.body);

        res.json(newProduct)

    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const productManager = req.app.get(manager);
        await productManager.deleteById(req.params.id);

        res.json({ success: true });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message });
    }
})

module.exports = router