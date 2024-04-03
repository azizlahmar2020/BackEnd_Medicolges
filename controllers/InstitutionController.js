// institutionController.js

const Institution = require('../models/Institution');

// Créer une nouvelle institution
exports.createInstitution = async (req, res) => {
  try {
    const { address, category, subcategory } = req.body;
    const newInstitution = new Institution({ address, category, subcategory });
    const savedInstitution = await newInstitution.save();
    res.status(201).json(savedInstitution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer toutes les institutions
exports.getAllInstitutions = async (req, res) => {
  try {
    const institutions = await Institution.find();
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer une institution par ID
exports.getInstitutionById = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) throw new Error('Institution not found');
    res.json(institution);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Mettre à jour une institution
exports.updateInstitution = async (req, res) => {
  try {
    const institution = await Institution.findById(req.params.id);
    if (!institution) throw new Error('Institution not found');

    // Mise à jour des champs de l'institution
    if (req.body.address) institution.address = req.body.address;
    if (req.body.category) institution.category = req.body.category;
    if (req.body.subcategory) institution.subcategory = req.body.subcategory;

    const updatedInstitution = await institution.save();
    res.json(updatedInstitution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une institution
exports.deleteInstitution = async (req, res) => {
  try {
    const deletedInstitution = await Institution.findByIdAndDelete(req.params.id);
    if (!deletedInstitution) throw new Error('Institution not found');
    res.json({ message: 'Institution deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};



























/*const Institution = require('../models/Institution');

// Créer une nouvelle institution
exports.createInstitution = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Effectuer la création de l'institution
    const { address, category, subcategory } = req.body;
    const newInstitution = new Institution({ address, category, subcategory });
    const savedInstitution = await newInstitution.save();
    res.status(201).json(savedInstitution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour une institution
exports.updateInstitution = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Récupérer et mettre à jour l'institution
    const institution = await Institution.findById(req.params.id);
    if (!institution) throw new Error('Institution not found');

    // Mise à jour des champs de l'institution
    if (req.body.address) institution.address = req.body.address;
    if (req.body.category) institution.category = req.body.category;
    if (req.body.subcategory) institution.subcategory = req.body.subcategory;

    const updatedInstitution = await institution.save();
    res.json(updatedInstitution);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une institution
exports.deleteInstitution = async (req, res) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const userRole = req.user.role;
    if (userRole !== 'admin' && userRole !== 'sub-admin') {
      return res.status(403).json({ message: 'Permission denied' });
    }

    // Supprimer l'institution
    const deletedInstitution = await Institution.findByIdAndDelete(req.params.id);
    if (!deletedInstitution) throw new Error('Institution not found');
    res.json({ message: 'Institution deleted successfully' });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
 */