// server/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const authMiddleware = require('../middleware/authMiddleware');

// All portfolio routes require authentication
router.use(authMiddleware);

// Get user portfolio
router.get('/', portfolioController.getPortfolio);
router.get('/:userId', portfolioController.getPortfolio);

// Get portfolio performance
router.get('/performance', portfolioController.getPortfolioPerformance);
router.get('/:userId/performance', portfolioController.getPortfolioPerformance);

// Get asset allocation
router.get('/allocation', portfolioController.getAssetAllocation);
router.get('/:userId/allocation', portfolioController.getAssetAllocation);

// Get portfolio risk analysis
router.get('/risk', portfolioController.getPortfolioRisk);
router.get('/:userId/risk', portfolioController.getPortfolioRisk);

// Create portfolio snapshot (used by scheduled jobs or manually)
router.post('/:portfolioId/snapshot', portfolioController.createPortfolioSnapshot);

module.exports = router; 