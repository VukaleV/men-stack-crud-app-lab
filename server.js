const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride('_method'));
app.use(express.static('public'));

// MongoDB Schema
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  calories: Number
});
const Food = mongoose.model('Food', foodSchema);

// EJS
app.set('view engine', 'ejs');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/foodDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// RESTful Routes

// Index
app.get('/foods', async (req, res) => {
  try {
    const foods = await Food.find();
    res.render('index', { foods });
  } catch (err) {
    console.error(err);
    res.send('Error fetching foods');
  }
});

// New
app.get('/foods/new', (req, res) => {
  res.render('new');
});

// Create
app.post('/foods', async (req, res) => {
  try {
    const { name, description, calories } = req.body;
    await Food.create({ name, description, calories });
    res.redirect('/foods');
  } catch (err) {
    console.error(err);
    res.send('Error creating food');
  }
});

// Show
app.get('/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.send('Food not found');
    res.render('show', { food });
  } catch (err) {
    console.error(err);
    res.send('Error fetching food');
  }
});

// Edit
app.get('/foods/:id/edit', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.send('Food not found');
    res.render('edit', { food });
  } catch (err) {
    console.error(err);
    res.send('Error fetching food for edit');
  }
});

// Update
app.put('/foods/:id', async (req, res) => {
  try {
    const { name, description, calories } = req.body;
    await Food.findByIdAndUpdate(req.params.id, { name, description, calories });
    res.redirect(`/foods/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.send('Error updating food');
  }
});

// Delete
app.delete('/foods/:id', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.redirect('/foods');
  } catch (err) {
    console.error(err);
    res.send('Error deleting food');
  }
});

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/foods');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
