const express = require('express');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');
const router = express.Router();

// Create recipe
router.post('/', auth, async (req, res) => {
  try {
    const data = req.body;
    data.author = req.user._id;
    const recipe = new Recipe(data);
    await recipe.save();
    res.json(recipe);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Get all recipes (with search & pagination)
router.get('/', async (req, res) => {
  try {
    const { q, tag, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (tag) filter.tags = tag;
    const recipes = await Recipe.find(filter)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((page - 1) * limit);
    res.json(recipes);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Get one
router.get('/:id', async (req, res) => {
  try {
    const r = await Recipe.findById(req.params.id).populate('author', 'name');
    if (!r) return res.status(404).json({ msg: 'Not found' });
    res.json(r);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Not found' });
    if (!recipe.author.equals(req.user._id)) return res.status(403).json({ msg: 'Forbidden' });
    Object.assign(recipe, req.body);
    await recipe.save();
    res.json(recipe);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ msg: 'Not found' });
    if (!recipe.author.equals(req.user._id)) return res.status(403).json({ msg: 'Forbidden' });
    await recipe.deleteOne();
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Like / unlike
router.post('/:id/like', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const idx = recipe.likes.indexOf(req.user._id);
    if (idx === -1) recipe.likes.push(req.user._id);
    else recipe.likes.splice(idx, 1);
    await recipe.save();
    res.json(recipe);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;
