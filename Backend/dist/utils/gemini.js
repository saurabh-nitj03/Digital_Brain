"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiService = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY environment variable is required');
        }
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        // Use a known working model
        this.model = this.genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash' });
    }
    generateResponse(query, contextChunks) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const context = contextChunks.join('\n\n');
                const prompt = `
You are a helpful AI assistant that answers questions based on the user's personal content. 
You have to use user's personal content and can infer your learning based on content


Context:
${context}

User Question: ${query}

Instructions:
1. Answer the question based ONLY on the provided context
2. Based on infromation provided , you can use your learning as well to respond
3. Be concise , explanatory  but comprehensive
4. Cite specific parts of the context when relevant
5. If the question is not related to the provided content, politely redirect the user to ask about their uploaded content

Answer:`;
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                return response.text();
            }
            catch (error) {
                console.error('Error generating response with Gemini:', error);
                throw new Error(`Failed to generate response: ${error}`);
            }
        });
    }
    generateSummary(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prompt = `
Please provide a brief summary of the following content in 2-3 sentences:

${content}

Summary:`;
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                return response.text();
            }
            catch (error) {
                console.error('Error generating summary with Gemini:', error);
                throw new Error(`Failed to generate summary: ${error}`);
            }
        });
    }
    generateKeywords(content) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prompt = `
Extract 5-10 key topics or keywords from the following content. Return them as a simple list:

${content}

Keywords:`;
                const result = yield this.model.generateContent(prompt);
                const response = yield result.response;
                // Parse the response to extract keywords
                const keywordsText = response.text();
                const keywords = keywordsText
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0 && !line.toLowerCase().includes('keywords:'))
                    .slice(0, 10);
                return keywords;
            }
            catch (error) {
                console.error('Error generating keywords with Gemini:', error);
                throw new Error(`Failed to generate keywords: ${error}`);
            }
        });
    }
}
exports.GeminiService = GeminiService;
// Use only the information provided in the context below to answer the user's question.
// 2. If the context doesn't contain enough information to answer the question, say "I don't have enough information in your content to answer this question."
