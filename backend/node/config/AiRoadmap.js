const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY3;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const chatSession = model.startChat({
  generationConfig,
  history: [], // Leave empty unless you want follow-up prompts
});

async function generateRoadmap(position) {
  const prompt = `
Generate a React flow tree-structured learning roadmap for user input position/skills in the following format:
• Vertical tree structure with meaningful x/y positions to form a flow
• Structure similar to roadmap.sh layout
• Steps ordered from fundamentals to advanced
• Include branching for different specializations (if applicable)
• Each node must have a title, short description, and learning resource link
• Use unique IDs for all nodes and edges
• Make node positions extremely spacious and non-overlapping
• Ensure branching paths are separated on the x-axis and y axis by at least 200-300px to avoid edge overlap
• Respond exactly and precisely as in the following JSON format, type must be turbo:
{
  roadmapTitle: "",
  description: <3-5 lines>,
  duration: "",
  initialNodes: [
    {
      id: '1',
      type: 'turbo',
      position: { x: 0, y: 0 },
      data: {
        title: 'Step Title',
        description: 'Short two-line explanation of what the step covers.',
        link: 'Helpful link for learning this step'
      }
    },
    ...
  ],
  initialEdges: [
    {
      id: 'e1-2',
      source: '1',
      target: '2'
    },
    ...
  ]
}

User input: ${position}
`;

  const result = await chatSession.sendMessage(prompt);
  const response = await result.response;
  const text = await response.text();

  console.log(text);
  return text;
}

// generateRoadmap("Frontend Developer");

module.exports = { generateRoadmap };
