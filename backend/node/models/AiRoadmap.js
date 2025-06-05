const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  promptInput: { type: String, required: true },
  roadmapData: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AiRoadmap', roadmapSchema);
