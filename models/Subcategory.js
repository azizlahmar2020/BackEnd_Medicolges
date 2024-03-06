const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
  subcategory_id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  subcategory_name: String,
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
