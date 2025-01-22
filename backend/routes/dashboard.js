const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middlewares/auth');
const dashboardController = require('../controllers/dashboardController');

// Middleware d'authentification
router.use(authenticateJWT);

// Routes du dashboard
router.get('/stats', dashboardController.getStats);
router.get('/staff', dashboardController.getStaffOverview);
router.get('/academic', dashboardController.getAcademicPerformance);
router.get('/classes', dashboardController.getClassesOverview);

module.exports = router;