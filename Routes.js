const express = require('express');
const router = express.Router();
const db = require('./fakeDB');

// GET /items - return all items
router.get('/items', (req, res) => {
  res.json(db.getItems());
});

// POST /items - add a new item
router.post('/items', (req, res) => {
  const { name, price } = req.body;
  const newItem = db.addItem(name, price);
  res.json(newItem);
});

// GET /items/:name - find item by name
router.get('/items/:name', (req, res) => {
  const item = db.getItemByName(req.params.name);
  res.json(item);
});

// PATCH /items/:name - update item by name
router.patch('/items/:name', (req, res) => {
  const updatedItem = db.updateItem(req.params.name, req.body);
  res.json(updatedItem);
});

// DELETE /items/:name - remove item by name
router.delete('/items/:name', (req, res) => {
  const result = db.removeItemByName(req.params.name);
  if (result) {
    res.json({ message: 'Deleted' });
  } else {
    res.json({ message: 'Delete failed' });
  }
});

module.exports = router;