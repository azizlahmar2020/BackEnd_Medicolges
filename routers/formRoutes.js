// formRoutes.js

const express = require('express');
const router = express.Router();
const formController = require('../controllers/FormController');

// Route to handle saving form data
router.post('/saveform', async (req, res) => {
  const formData = req.body;

  // Save the form data using the form controller
  const result = await formController.saveFormData(formData);

  if (result.success) {
    res.status(200).json({ message: result.message });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Route to handle fetching form data
router.get('/showforms', async (req, res) => {
    try {
      // Fetch form data from the database
      const forms = await formController.getAllForms();
  
      // Send the form data as the API response
      res.json(forms);
    } catch (error) {
      // Handle errors
      console.error('Error fetching form data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // Route to handle fetching form fields based on form ID
router.get('/:formId/fields', async (req, res) => {
    try {
      const formId = req.params.formId;
      // Fetch form fields from the database based on form ID
      const formFields = await formController.getFormFields(formId);
  
      // Send the form fields as the API response
      res.json(formFields);
    } catch (error) {
      // Handle errors
      console.error('Error fetching form fields:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;
