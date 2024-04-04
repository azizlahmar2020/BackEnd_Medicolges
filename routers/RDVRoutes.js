// routes/rendezVousRoutes.js

const express = require('express');
const router = express.Router();
const RendezVous = require('../models/RDV');

// Route pour récupérer tous les rendez-vous
router.get('/rend', async (req, res) => {
  try {
    const rendezVous = await RendezVous.find();
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route pour créer un nouveau rendez-vous
router.post('/add', async (req, res) => {
  const rendezVous = new RendezVous({
    date: req.body.date,
    heure: req.body.heure,
    docteur: req.body.docteur,
    patient: req.body.patient
  });

  try {
    const newRendezVous = await rendezVous.save();
    res.status(201).json(newRendezVous);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route pour supprimer un rendez-vous
router.delete('/delete/:id', async (req, res) => {
  try {
    const rendezVous = await RendezVous.findOneAndDelete({ _id: req.params.id });
    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json({ message: 'Rendez-vous supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route pour mettre à jour un rendez-vous
router.patch('/update/:id', async (req, res) => {
  try {
    const updatedRendezVous = await RendezVous.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedRendezVous);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/getPatientRdv/:id',async( req,res)=>{
  try {
    const rendezVous = await RendezVous.find({patient:req.params.id});
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

router.get('/getDoctorRdv/:id',async( req,res)=>{
  try {
    const rendezVous = await RendezVous.find({docteur:req.params.id});
    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

module.exports = router;
