const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const newsSchema = new Schema({
  title:{
    type: String,
    required: true
  },

  url:{
    type: String,
    required: true
  },

  content:{
    type: String,
    required: false
  },

  source:{
    type: String,
    required: true
  }
});

module.exports = mongoose.model('News', newsSchema);
