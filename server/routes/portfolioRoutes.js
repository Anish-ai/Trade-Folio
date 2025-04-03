const express = require('express');
const { portfolioController } = require('../controllers/portfolioController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply authentication middleware to all portfolio routes
router.use(authMiddleware);

// Portfolio routes
router.get('/user/:userId', portfolioController.getUserPortfolio);
router.post('/', portfolioController.createPortfolio);

// Holdings management
router.post('/:portfolioId/holdings', portfolioController.addHolding);
router.put('/holdings', portfolioController.updateHolding);
router.delete('/holdings/:holdingId', portfolioController.deleteHolding);

// Portfolio history/analytics
router.get('/:portfolioId/history', portfolioController.getPortfolioHistory);
router.post('/:portfolioId/snapshot', portfolioController.createPortfolioSnapshot);

module.exports = router;