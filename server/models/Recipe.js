const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [{ name: String, amount: String }],
  steps: [String],
  cookTime: String,
  tags: [String],
  imageUrl: String, // store Cloudinary URL or any URL
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);
