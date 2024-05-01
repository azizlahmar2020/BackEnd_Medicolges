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
    patient: req.body.patient,
    RoomUrl: req.body.RoomUrl,
    Status:req.body.Status
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

router.get('/getRdv/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Recherche des rendez-vous pour un docteur ou un patient en fonction de leur ID
    const rendezVous = await RendezVous.find({ $or: [{ docteur: id }, { patient: id }] });

    if (!rendezVous) {
      return res.status(404).json({ message: "Aucun rendez-vous trouvé pour cet utilisateur." });
    }

    res.status(200).json(rendezVous);
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous :", error);
    res.status(500).json({ message: "Erreur serveur lors de la récupération des rendez-vous." });
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
