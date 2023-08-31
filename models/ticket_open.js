const { model, Schema } = require('mongoose');

const sch = new Schema({
  Guild: String,
  Channel: String,
  Opener: String,
  Claimer: String,
  System: String,
  Date: String,
  Type: String,
  AllowSkip: String,
  TMessage: String,
  TChannel: String,
  TButton: String,
  TDesc: String,
  opeColor: String,
})

module.exports = model('ticket_c', sch)