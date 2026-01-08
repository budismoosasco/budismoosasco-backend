require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Event = require('./models/Event');

const app = express();

app.use(cors());
app.use(express.json());

/* LOGIN ADMIN */
app.post('/api/admin/login', (req, res) => {
  const { senha } = req.body;

  if (senha === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false });
});

/* ROTA TESTE */
app.get('/', (req, res) => {
  res.send('Servidor do Templo está rodando.');
});

/* BUSCAR TODOS OS EVENTOS */
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ data: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});

/* BUSCAR 1 EVENTO PARA EDITAR */
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});

/* CRIAR EVENTO */
app.post('/api/events', async (req, res) => {
  try {
    const novoEvento = new Event(req.body);
    await novoEvento.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

/* EDITAR EVENTO */
app.put('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

/* EXCLUIR EVENTO */
app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir evento' });
  }
});

/* INICIAR SERVIDOR */
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

  } catch (err) {
    console.error("Erro ao conectar:", err);
  }
}

start();
