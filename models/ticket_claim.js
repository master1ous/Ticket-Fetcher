const { model, Schema } = require('mongoose');

const sch = new Schema({
  Guild: String,
  Channel: String,
  Opener: String,
  Claimer: String,
  System: String,
  Date: String,
  AllowSkip: String,
  TMessage: String,
  TChannel: String,
  TButton: String,
  TDesc: String,
})

module.exports = model('ticket_cl', sch)