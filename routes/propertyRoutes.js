const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const upload = require('../utils/cloudinary');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// 1. PUBLIC ENDPOINTS (No authentication required)


// Task 2.5.1: Search and Browse listings
router.get('/search', propertyController.searchProperties);
router.get('/all', propertyController.getAllProperties);
router.get('/', propertyController.getAllProperties);

// Fetch a single property by ID (Essential for frontend details view)
router.get('/:id', propertyController.getProperty || propertyController.getPropertyById);

// 2. SECURE ENDPOINTS (Requires Login + Specific Roles)


// Task 2.1.2 & 2.1.4: Multi-platform upload + Listing Creation
router.post('/create',
    protect,
    restrictTo('landlord', 'agent', 'admin'),
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'documents', maxCount: 2 }
    ]),
    propertyController.createProperty
);

// Task 2.3.2: Manage listings securely
router.patch('/update/:id', protect, restrictTo('landlord', 'agent', 'admin'), propertyController.updateProperty);
router.delete('/delete/:id', protect, restrictTo('landlord', 'agent', 'admin'), propertyController.deleteProperty);


// 3. ADMIN-ONLY MANAGEMENT ENDPOINTS

// Task 1.4.1: Admin-only compliance verification
router.patch('/verify/:id', protect, restrictTo('admin'), propertyController.verifyProperty);

module.exports = router;