const { model, Schema } = require('mongoose');

const sch = new Schema({
  Guild: String,
  Channel: String,
  Opener: String,
  Category: String,
  Claimer: String,
  System: String,
  Admin: String,
  OpenMsg: String,
  Logging: String,
  TMessage: String,
  TChannel: String,
  TButton: String,
  TDesc: String,
})

module.exports = model('ticket_log', sch)