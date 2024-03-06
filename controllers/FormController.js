// formController.js

const FormModel = require('../models/form');

// Function to save form data to MongoDB
async function saveFormData(formData) {
  try {
      // Check if formData is an array
      if (!Array.isArray(formData)) {
          throw new Error('Form data is not in the expected format');
      }

      // Create an array to store formatted form components
      const formattedComponents = [];

      // Iterate over each form field in formData
      formData.forEach(field => {
          // If the field type is 'radio-group', format the options
          if (field.type === 'radio-group') {
              // Create an array to store formatted radio options
              const formattedOptions = field.values.map(option => ({
                  label: option.label,
                  value: option.value,
                  selected: option.selected || false
              }));

              // Add the formatted radio group to the array of components
              formattedComponents.push({
                  type: field.type,
                  required: field.required || false,
                  label: field.label,
                  inline: field.inline || false,
                  name: field.name,
                  access: field.access || false,
                  other: field.other || false,
                  values: formattedOptions // Include the formatted options
              });
          } else {
              // For other field types, simply add them to the array of components
              formattedComponents.push({
                  type: field.type,
                  required: field.required || false,
                  label: field.label,
                  className: field.className || '',
                  name: field.name,
                  access: field.access || false,
                  subtype: field.subtype || ''
              });
          }
      });

      // Create a new instance of the Form model with the formatted form components
      const newForm = new FormModel({ components: formattedComponents });

      // Save the form data to MongoDB
      await newForm.save();

      console.log('Form data saved successfully');
      return { success: true, message: 'Form data saved successfully' };
  } catch (error) {
      console.error('Error saving form data:', error);
      return { success: false, error: 'Error saving form data' };
  }
}
  

// Function to get all forms from the database
async function getAllForms() {
    try {
      const forms = await FormModel.find();
      return forms;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw new Error('Error fetching forms');
    }
  }

// Function to get form fields based on form ID
async function getFormFields(formId) {
    try {
      // Find the form by its ID and select the components field
      const form = await FormModel.findById(formId).select('components');
      if (!form) {
        throw new Error('Form not found');
      }
      return form.components;
    } catch (error) {
      console.error('Error fetching form fields:', error);
      throw new Error('Error fetching form fields');
    }
  }

module.exports = {
  saveFormData,
  getAllForms,
  getFormFields
};
