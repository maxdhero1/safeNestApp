const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const upload = require('../utils/cloudinary'); 

const { protect, restrictTo } = require('../middlewares/authMiddleware');


// PUBLIC ENDPOINTS (No authentication required)


// Task 2.5.1: Search and Browse listings
router.get('/search', propertyController.searchProperties);
router.get('/all', propertyController.getAllProperties);
router.get('/', propertyController.getAllProperties); 

//  ADDITION: Fetch a single property by ID (Essential for the frontend details page)
router.get('/:id', propertyController.getProperty || propertyController.getPropertyById || ((req, res) => res.status(501).json({ message: "Get single property endpoint" })));


// SECURE LANDLORD / AGENT / ADMIN ENDPOINTS


// Task 2.1.2 & 2.1.4: Multi-platform upload + Security
router.post('/create', 
    protect, 
    restrictTo('landlord', 'agent', 'admin'), 
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'documents', maxCount: 2 }
    ]), 
    propertyController.createProperty
);

// Fallback traditional REST endpoint
router.post('/', protect, restrictTo('landlord', 'agent', 'admin'), propertyController.createProperty);

// Task 2.3.2: Manage listings securely
router.patch('/update/:id', protect, restrictTo('landlord', 'agent', 'admin'), propertyController.updateProperty);
router.delete('/delete/:id', protect, restrictTo('landlord', 'agent', 'admin'), propertyController.deleteProperty);

// Legacy URL route bindings for backward compatibility
router.route('/:id')
    .patch(protect, restrictTo('landlord', 'agent', 'admin'), propertyController.updateProperty)
    .delete(protect, restrictTo('landlord', 'agent', 'admin'), propertyController.deleteProperty);


// ADMIN-ONLY ROUTES


// Task 1.4.1: Admin-only verification for verification badges
router.patch('/verify/:id', protect, restrictTo('admin'), propertyController.verifyProperty);

module.exports = router;