const express = require('express');
const router = express.Router();
const SubcategoryController = require('../controllers/SubcategoryController');

// Create Subcategory
router.post('/subcategories', SubcategoryController.createSubcategory);

// Get all Subcategories
router.get('/subcategories', SubcategoryController.getAllSubcategories);

// Get Subcategory by ID
router.get('/subcategories/:id', SubcategoryController.getSubcategoryById);

// Update Subcategory
router.patch('/subcategories/:id', SubcategoryController.updateSubcategory);

// Delete Subcategory
router.delete('/subcategories/:id', SubcategoryController.deleteSubcategory);

module.exports = router;
