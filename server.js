require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importação correta do MODEL
const Event = require('./models/Event');

const app = express();

app.use(cors());
app.use(express.json());

// -------------------------------------------
// LOGIN DO ADMIN
// -------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const { senha } = req.body;

  if (!senha) {
    return res.status(400).json({ error: 'Senha não enviada.' });
  }

  if (senha === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  return res.status(401).json({ error: 'Senha incorreta.' });
});

// -------------------------------------------
// ROTA DE TESTE
// -------------------------------------------
app.get('/', (req, res) => {
  res.send('Servidor do templo está rodando corretamente.');
});

// -------------------------------------------
// LISTAR EVENTOS
// -------------------------------------------
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ data: 1 });
    res.json(events);
  } catch (error) {
    console.error("ERRO NO GET /api/events:", error);
    res.status(500).json({ error: error.message });
  }
});

// -------------------------------------------
// CRIAR EVENTO
// -------------------------------------------
app.post('/api/events', async (req, res) => {
  try {
    const novoEvento = new Event(req.body);
    await novoEvento.save();
    res.json({ success: true, event: novoEvento });
  } catch (error) {
    console.error("ERRO NO POST /api/events:", error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});

// -------------------------------------------
// ATUALIZAR EVENTO
// -------------------------------------------
app.put('/api/events/:id', async (req, res) => {
  try {
    const eventUpdated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, event: eventUpdated });
  } catch (error) {
    console.error("ERRO NO PUT /api/events/:id:", error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});

// -------------------------------------------
// EXCLUIR EVENTO
// -------------------------------------------
app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error("ERRO NO DELETE /api/events/:id:", error);
    res.status(500).json({ error: 'Erro ao excluir evento' });
  }
});

// -------------------------------------------
// INICIALIZAÇÃO DO SERVIDOR
// -------------------------------------------
async function startServer() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado com sucesso');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
  }
}

startServer();