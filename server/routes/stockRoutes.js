const express = require('express');
const router = express.Router();
const {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    updateStockPrice,
    deleteStock
} = require('../controllers/stockController');

// GET /stocks?page=1&limit=10&sector=Technology&sortBy=marketCap&sortOrder=desc
router.get('/', getAllStocks);

// GET /stocks/:id
router.get('/:id', getStockById);

// POST /stocks
router.post('/', createStock);

// PUT /stocks/:id (general update)
router.put('/:id', updateStock);

// PATCH /stocks/:id/price (special price update)
router.patch('/:id/price', updateStockPrice);

// DELETE /stocks/:id
router.delete('/:id', deleteStock);

// Additional useful endpoints
// GET /stocks/symbol/:symbol
router.get('/symbol/:symbol', async (req, res) => {
    // Implementation similar to getStockById but using symbol
});

module.exports = router;