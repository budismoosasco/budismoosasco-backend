require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
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

// rota de teste (importante para verificar se o servidor está vivo)
app.get('/', (req, res) => {
  res.send('Servidor do templo está rodando');
});

async function startServer() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado com sucesso');

    app.use('/api/events', require('./routes/events'));
    app.use('/api/contact', require('./routes/contact'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
  }
}


startServer();
