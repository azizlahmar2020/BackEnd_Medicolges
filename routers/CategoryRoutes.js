// categoryRouter.js

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');

// Créer une nouvelle catégorie
router.post('/categories', categoryController.createCategory);

// Récupérer toutes les catégories
router.get('/categories', categoryController.getAllCategories);

// Récupérer une catégorie par ID
router.get('/categories/:id', categoryController.getCategoryById);

// Mettre à jour une catégorie
router.patch('/categories/:id', categoryController.updateCategory);

// Supprimer une catégorie
router.delete('/categories/:id', categoryController.deleteCategory);

module.exports = router;
