require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Event = require('./models/Event');

const app = express();

/* ============================
   CONFIGURAÇÕES DO SERVIDOR
============================= */

app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type"
}));

app.use(express.json());


/* ============================
   LOGIN ADMIN
============================= */

app.post('/api/admin/login', (req, res) => {
  const { senha } = req.body;

  if (!senha) {
    return res.status(400).json({ success: false, error: "Senha não enviada" });
  }

  if (senha === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true });
  }

  return res.status(401).json({ success: false, error: "Senha incorreta" });
});


/* ============================
   ROTA TESTE
============================= */

app.get('/', (req, res) => {
  res.send('Servidor do Templo está rodando corretamente.');
});


/* ============================
   BUSCAR TODOS OS EVENTOS
============================= */

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ data: 1 });
    res.json(events);
  } catch (error) {
    console.error("ERRO GET /api/events:", error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
});


/* ============================
   BUSCAR 1 EVENTO
============================= */

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json(event);
  } catch (error) {
    console.error("ERRO GET /api/events/:id:", error);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
});


/* ============================
   CRIAR EVENTO
============================= */

app.post('/api/events', async (req, res) => {
  try {
    const { titulo, descricao, data, horario, local } = req.body;

    const novoEvento = new Event({
      titulo,
      descricao,
      data,     // ❗ agora como STRING, sem fuso horário
      horario,
      local
    });

    await novoEvento.save();

    res.json({ success: true, evento: novoEvento });

  } catch (error) {
    console.error("ERRO POST /api/events:", error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
});


/* ============================
   EDITAR EVENTO
============================= */

app.put('/api/events/:id', async (req, res) => {
  try {
    const { titulo, descricao, data, horario, local } = req.body;

    const atualizado = await Event.findByIdAndUpdate(
      req.params.id,
      { titulo, descricao, data, horario, local },
      { new: true }
    );

    if (!atualizado) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json({ success: true, evento: atualizado });

  } catch (error) {
    console.error("ERRO PUT /api/events/:id:", error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
});


/* ============================
   EXCLUIR EVENTO
============================= */

app.delete('/api/events/:id', async (req, res) => {
  try {
    const deletado = await Event.findByIdAndDelete(req.params.id);

    if (!deletado) {
      return res.status(404).json({ error: "Evento não encontrado" });
    }

    res.json({ success: true });

  } catch (error) {
    console.error("ERRO DELETE /api/events/:id:", error);
    res.status(500).json({ error: 'Erro ao excluir evento' });
  }
});


/* ============================
   INICIAR SERVIDOR
============================= */

async function start() {
  try {
    console.log("Conectando ao MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB conectado com sucesso!");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
}

start();
