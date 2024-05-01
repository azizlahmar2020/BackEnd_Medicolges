// models/RendezVous.js

const mongoose = require('mongoose');

const rendezVousSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  heure: {
    type: String,
    required: true
  },
  docteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Docteur',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  RoomUrl: {
    type: String,
    required: true
  },
  Status:{
    type: String,
    required:true
  }
});

const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous;
