// formModel.js

const mongoose = require('mongoose');

// Define the schema for form submissions
const formSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String
  },
  // Add a field to store components
  components: [
    {
      type: {
        type: String,
      },
      label: {
        type: String,
      },
      // Add more properties as needed for each component
      // For example:
      options: [String] // If the component is a select dropdown, store options in an array
    }
  ]
}, { timestamps: true });

// Create a model using the schema
const Form = mongoose.model('forms', formSchema);

module.exports = Form;
