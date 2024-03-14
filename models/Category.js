const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category_id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  category_name: String,
});

module.exports = mongoose.model('Category', categorySchema);
