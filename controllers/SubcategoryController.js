const Subcategory = require('../models/Subcategory');

// Create Subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { subcategory_name, category_id } = req.body;
    const newSubcategory = new Subcategory({ subcategory_name, category_id });
    const savedSubcategory = await newSubcategory.save();
    res.status(201).json(savedSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all Subcategories
exports.getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) throw new Error('Subcategory not found');
    res.json(subcategory);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Update Subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) throw new Error('Subcategory not found');

    // Update Subcategory fields
    if (req.body.subcategory_name) subcategory.subcategory_name = req.body.subcategory_name;
    if (req.body.category_id) subcategory.category_id = req.body.category_id;

    const updatedSubcategory = await subcategory.save();
    res.json(updatedSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const deletedSubcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!deletedSubcategory) throw new Error('Subcategory not found');
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};





































/*const Subcategory = require('../models/Subcategory');

// Create Subcategory
exports.createSubcategory = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Effectuer la création de la sous-catégorie
    const { subcategory_name, category_id } = req.body;
    const newSubcategory = new Subcategory({ subcategory_name, category_id });
    const savedSubcategory = await newSubcategory.save();
    res.status(201).json(savedSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Récupérer et mettre à jour la sous-catégorie
    const subcategory = await Subcategory.findById(req.params.id);
    if (!subcategory) throw new Error('Subcategory not found');

    // Mise à jour des champs de la sous-catégorie
    if (req.body.subcategory_name) subcategory.subcategory_name = req.body.subcategory_name;
    if (req.body.category_id) subcategory.category_id = req.body.category_id;

    const updatedSubcategory = await subcategory.save();
    res.json(updatedSubcategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Supprimer la sous-catégorie
    const deletedSubcategory = await Subcategory.findByIdAndDelete(req.params.id);
    if (!deletedSubcategory) throw new Error('Subcategory not found');
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
 */