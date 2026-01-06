const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descricao: {
    type: String
  },
  data: {
    type: Date,
    required: true
  },
  horario: {
    type: String
  },
  local: {
    type: String
  },
  tipo: {
    type: String
  },
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', EventSchema);