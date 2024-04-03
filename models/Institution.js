const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionSchema = new Schema({
  institution_id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  address: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'Subcategory',
  }
});

module.exports = mongoose.model('Institution', institutionSchema);
