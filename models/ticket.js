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
  Type: String,
  Style: String,
  AllowSkip: String,
  TMessage: String,
  TChannel: String,
  TButton: String,
  TDesc: String,
  Mention: String,
  ImageD: String,
  ImageM: String,
  embColor: String,
  opeColor: String,
})

module.exports = model('ticket', sch)