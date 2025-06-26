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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIAgent = void 0;
const contentProcessor_1 = require("./contentProcessor");
const gemini_1 = require("./gemini");
const embed_1 = require("./embed");
const mongo_1 = require("./mongo");
const chunkText_1 = __importDefault(require("./chunkText"));
class AIAgent {
    constructor() {
        this.geminiService = new gemini_1.GeminiService();
    }
    /**
     * Process and store user content
     */
    processAndStoreContent(userId, content, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Processing content for user:', userId);
                // Step 1: Process the content based on its type
                const processedContent = yield contentProcessor_1.ContentProcessor.processContent(content, contentType);
                console.log('Content processed successfully:', processedContent.type);
                // Step 2: Generate summary and keywords
                // const summary = await this.geminiService.generateSummary(processedContent.text);
                // const keywords = await this.geminiService.generateKeywords(processedContent.text);
                // Step 3: Chunk the text
                const chunks = yield (0, chunkText_1.default)(processedContent.text);
                console.log(`Text chunked into ${chunks.length} pieces`);
                // Step 4: Generate embeddings for chunks
                const embedChunks = yield (0, embed_1.embedSentences)(chunks);
                console.log('Embeddings generated successfully');
                // Step 5: Add source and metadata information
                const chunksWithMetadata = embedChunks.map(chunk => (Object.assign(Object.assign({}, chunk), { source: processedContent.source, contentType: processedContent.type, metadata: {
                        originalSource: processedContent.source,
                        contentType: processedContent.type
                    } })));
                // Step 6: Store chunks in MongoDB
                yield (0, mongo_1.storeChunks)(userId, chunksWithMetadata);
                console.log('Chunks stored in database');
                return {
                    success: true,
                    message: `Content processed and stored successfully. Generated ${chunks.length} chunks.`,
                    processedContent,
                    // summary,
                    // keywords
                };
            }
            catch (error) {
                console.error('Error processing and storing content:', error);
                return {
                    success: false,
                    message: `Failed to process content: ${error}`
                };
            }
        });
    }
    /**
     * Query the AI agent with user questions
     */
    queryAgent(userId, question) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Processing query for user:', userId);
                console.log('Question:', question);
                // Step 1: Generate embedding for the query
                const queryEmbedding = yield (0, embed_1.embedQuery)(question);
                console.log('Query embedding generated');
                // Step 2: Search for similar chunks in the database
                const similarChunks = yield (0, mongo_1.searchChunks)(userId, queryEmbedding, 5);
                console.log(`Found ${similarChunks.length} similar chunks`);
                if (similarChunks.length === 0) {
                    return {
                        answer: "I don't have enough information in your content to answer this question. Please upload some relevant content first.",
                        sources: [],
                        confidence: 0
                    };
                }
                // Step 3: Extract text from similar chunks
                const contextChunks = similarChunks.map(chunk => chunk.chunktext);
                const sources = similarChunks.map(chunk => chunk.source || 'Unknown source');
                // Step 4: Generate response using Gemini
                const answer = yield this.geminiService.generateResponse(question, contextChunks);
                console.log('Response generated successfully');
                // Step 5: Calculate confidence based on similarity scores
                const confidence = this.calculateConfidence(similarChunks);
                return {
                    answer,
                    sources: [...new Set(sources)], // Remove duplicates
                    confidence
                };
            }
            catch (error) {
                console.error('Error querying agent:', error);
                return {
                    answer: `Sorry, I encountered an error while processing your question: ${error}`,
                    sources: [],
                    confidence: 0
                };
            }
        });
    }
    /**
     * Get user's content summary
     */
    // async getUserContentSummary(userId: string): Promise<{
    //   totalChunks: number;
    //   contentTypes: string[];
    //   recentUploads: any[];
    // }> {
    //   try {
    //     const chunks = await getUserChunks(userId);
    //     const contentTypes = [...new Set(chunks.map(chunk => chunk.contentType))];
    //     const recentUploads = chunks
    //       .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    //       .slice(0, 10)
    //       .map(chunk => ({
    //         source: chunk.source,
    //         contentType: chunk.contentType,
    //         createdAt: chunk.createdAt
    //       }));
    //     return {
    //       totalChunks: chunks.length,
    //       contentTypes,
    //       recentUploads
    //     };
    //   } catch (error) {
    //     console.error('Error getting user content summary:', error);
    //     throw error;
    //   }
    // }
    /**
     * Calculate confidence score based on similarity results
     */
    calculateConfidence(similarChunks) {
        // If chunks have similarity scores, use them to calculate confidence
        if (similarChunks.length > 0 && similarChunks[0].score !== undefined) {
            const avgScore = similarChunks.reduce((sum, chunk) => sum + (chunk.score || 0), 0) / similarChunks.length;
            return Math.min(avgScore, 1.0); // Normalize to 0-1
        }
        // Fallback confidence based on number of relevant chunks found
        return Math.min(similarChunks.length / 5, 1.0);
    }
    /**
     * Delete user's content
     */
    deleteUserContent(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, mongo_1.deleteUserChunks)(userId);
                return {
                    success: true,
                    message: `Successfully deleted ${result.deletedCount} chunks`
                };
            }
            catch (error) {
                console.error('Error deleting user content:', error);
                return {
                    success: false,
                    message: `Failed to delete user content: ${error}`
                };
            }
        });
    }
}
exports.AIAgent = AIAgent;
