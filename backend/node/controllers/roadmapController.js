const AiRoadmap = require('../models/AiRoadmap');
const { generateRoadmap } = require('../config/AiRoadmap');

exports.createRoadmap = async (req, res) => {
  try {
    const { userId, position } = req.body;
    if (!userId || !position) {
      return res.status(400).json({ error: 'userId and position are required' });
    }

    const responseText = await generateRoadmap(position);
    const cleanJson = responseText.trim().replace(/^```json|```$/g, '').trim();
    const roadmapData = JSON.parse(cleanJson);

    const newRoadmap = new AiRoadmap({
      user: userId,
      promptInput: position,
      roadmapData
    });

    await newRoadmap.save();

    res.status(201).json(newRoadmap);
  } catch (error) {
    console.error('Error creating roadmap:', error.message);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
};

exports.getRoadmapById = async (req, res) => {
  try {
    const { roadmapId } = req.params;

    const roadmap = await AiRoadmap.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }

    res.status(200).json(roadmap);
  } catch (error) {
    console.error('Error fetching roadmap:', error.message);
    res.status(500).json({ error: 'Failed to fetch roadmap' });
  }
};

exports.getRoadmapsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const roadmaps = await AiRoadmap.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(roadmaps);
  } catch (error) {
    console.error('Error fetching roadmaps:', error.message);
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
};

