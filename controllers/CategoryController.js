// categoryController.js

const Category = require('../models/Category');

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    const { category_name, subcategory } = req.body;
    const newCategory = new Category({ category_name, subcategory });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer toutes les catégories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une catégorie par ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new Error('Category not found');
    res.json(category);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) throw new Error('Category not found');

    // Mise à jour des champs de la catégorie
    if (req.body.category_name) category.category_name = req.body.category_name;
    if (req.body.subcategory) category.subcategory = req.body.subcategory;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) throw new Error('Category not found');
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



































/*const Category = require('../models/Category');

// Créer une nouvelle catégorie
exports.createCategory = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Effectuer la création de la catégorie
    const { category_name, subcategory } = req.body;
    const newCategory = new Category({ category_name, subcategory });
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une catégorie
exports.updateCategory = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Récupérer et mettre à jour la catégorie
    const category = await Category.findById(req.params.id);
    if (!category) throw new Error('Category not found');

    // Mise à jour des champs de la catégorie
    if (req.body.category_name) category.category_name = req.body.category_name;
    if (req.body.subcategory) category.subcategory = req.body.subcategory;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une catégorie
exports.deleteCategory = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Supprimer la catégorie
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) throw new Error('Category not found');
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
 */