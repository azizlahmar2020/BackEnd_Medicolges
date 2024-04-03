const formService = require("../sevices/form.service");

exports.saveForm = async (req, res) => {
  try {
    const result = await formService.saveFormData(req.body);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const result = await formService.getAllForms();
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const result = await formService.getFormById(req.query.id);
    res.send(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.saveResponse = async (req, res) => {
  try {
    const result = await formService.saveResponse(req.body);
    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getTotalResponseCount = async (req, res) => {
  try {
    const result = await formService.getTotalResponseCount();
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    // Le fichier uploadé est accessible via req.file
    const filePath = req.file.path; // Chemin temporaire du fichier uploadé

    // Vous pouvez maintenant traiter le fichier comme vous le souhaitez, par exemple le déplacer vers un autre répertoire ou le stocker dans la base de données.

    // Vous pouvez ensuite renvoyer le chemin du fichier ou d'autres informations au client si nécessaire
    res.json({ filePath: filePath });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
