// institutionRoutes.js

const express = require('express');
const router = express.Router();
const InstitutionController=require("../controllers/InstitutionController");
// Créer une nouvelle institution
router.post('/institutions', InstitutionController.createInstitution);

// Récupérer toutes les institutions
router.get('/institutions', InstitutionController.getAllInstitutions);

// Récupérer une institution par ID
router.get('/institutions/:id', InstitutionController.getInstitutionById);

// Mettre à jour une institution
router.patch('/institutions/:id', InstitutionController.updateInstitution);

// Supprimer une institution
router.delete('/institutions/:id', InstitutionController.deleteInstitution);

module.exports = router;
