import axios from 'axios';

 const interviewService = {

async saveTranscript({conversationData,id}) {
    if (!Array.isArray(conversationData) || conversationData.length === 0) {
      throw new Error('Invalid conversation data');
    }
    try {
      const response = await axios.post(`http://localhost:8000/api/lectures/${id}/transcript`, {
        transcriptPdfUrl: conversationData,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to save transcript');
    }
  }
};
export default interviewService;


