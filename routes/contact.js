const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const enviarEmail = require('../services/email');

// enviar mensagem
router.post('/', async (req, res) => {
  try {
    const mensagem = new Contact(req.body);
    await mensagem.save();
    await enviarEmail(req.body);
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar contato' });
  }
});

// listar mensagens (admin)
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {

  try {
    const mensagens = await Contact.find().sort({ data: -1 });
    res.json(mensagens);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

module.exports = router;