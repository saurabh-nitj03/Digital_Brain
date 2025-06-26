import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    // Use a known working model
    this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
  }

  async generateResponse(query: string, contextChunks: string[]): Promise<string> {
    try {
      const context = contextChunks.join('\n\n');
      const prompt = `
You are a helpful AI assistant that answers questions based on the user's personal content. 
Use only the information provided in the context below to answer the user's question.

Context:
${context}

User Question: ${query}

Instructions:
1. Answer the question based ONLY on the provided context
2. If the context doesn't contain enough information to answer the question, say "I don't have enough information in your content to answer this question."
3. Be concise but comprehensive
4. Cite specific parts of the context when relevant
5. If the question is not related to the provided content, politely redirect the user to ask about their uploaded content

Answer:`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response with Gemini:', error);
      throw new Error(`Failed to generate response: ${error}`);
    }
  }

  async generateSummary(content: string): Promise<string> {
    try {
      const prompt = `
Please provide a brief summary of the following content in 2-3 sentences:

${content}

Summary:`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating summary with Gemini:', error);
      throw new Error(`Failed to generate summary: ${error}`);
    }
  }

  async generateKeywords(content: string): Promise<string[]> {
    try {
      const prompt = `
Extract 5-10 key topics or keywords from the following content. Return them as a simple list:

${content}

Keywords:`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      // Parse the response to extract keywords
      const keywordsText = response.text();
      const keywords = keywordsText
        .split('\n')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0 && !line.toLowerCase().includes('keywords:'))
        .slice(0, 10);
      return keywords;
    } catch (error) {
      console.error('Error generating keywords with Gemini:', error);
      throw new Error(`Failed to generate keywords: ${error}`);
    }
  }
} 