const express = require("express");
const formController = require("../controllers/form.controller");
const multer = require("multer"); // Importer multer

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Spécifier le répertoire de destination pour les fichiers uploadés

router.route("/saveForm").post(formController.saveForm);
router.route("/getForms").get(formController.getForms);
router.route("/getFormById/").get(formController.getFormById);
router.route("/saveResponse/").post(formController.saveResponse);
router.route("/getTotalResponseCount/").get(formController.getTotalResponseCount);
router.route("/upload").post(upload.single("file"), formController.uploadFile); // Ajouter une route pour gérer l'upload de fichiers

module.exports = router;
