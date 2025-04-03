// server/routes/marketplaceRoutes.js
const express = require('express');
const {
  getMarketEvents,
  buyStock,
  sellStock,
  getMarketTrends,
  getSectors
} = require('../controllers/marketplaceController');

const router = express.Router();

// Market discovery endpoints
router.get('/events', getMarketEvents);
router.get('/trends', getMarketTrends);
router.get('/sectors', getSectors);

// Trading endpoints
router.post('/buy', buyStock);
router.post('/sell', sellStock);

module.exports = router;