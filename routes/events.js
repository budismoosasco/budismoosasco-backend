const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Criar evento
router.post('/', async (req, res) => {
  try {
    const evento = new Event(req.body);
    await evento.save();
    res.status(201).json(evento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Listar eventos
router.get('/', async (req, res) => {
  try {
    const eventos = await Event.find().sort({ data: 1 });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;