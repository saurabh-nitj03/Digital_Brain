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
const pinecone_1 = require("./pinecone");
const chunkText_1 = __importDefault(require("./chunkText"));
class AIAgent {
    constructor() {
        this.geminiService = new gemini_1.GeminiService();
    }
    processAndStoreContent(userId, content, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log(, userId);
                // Step 1: Process the content based on its type
                const processedContent = yield contentProcessor_1.ContentProcessor.processContent(content, contentType);
                // console.log('Content processed :', processedContent.type)
                const chunks = yield (0, chunkText_1.default)(processedContent.text);
                const embedChunks = yield (0, embed_1.embedSentences)(chunks);
                const chunksWithMetadata = embedChunks.map(chunk => (Object.assign(Object.assign({}, chunk), { source: processedContent.source, contentType: processedContent.type, metadata: {
                        originalSource: processedContent.source,
                        contentType: processedContent.type
                    } })));
                yield (0, pinecone_1.storeChunks)(userId, chunksWithMetadata);
                return {
                    success: true,
                    message: `Content processed and stored successfully. Generated ${chunks.length} chunks.`,
                    processedContent,
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
    queryAgent(userId, question) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryEmbedding = yield (0, embed_1.embedQuery)(question);
                const similarChunks = yield (0, pinecone_1.searchChunks)(userId, queryEmbedding, 5);
                console.log(`Found ${similarChunks.length} similar chunks`);
                if (similarChunks.length === 0) {
                    return {
                        answer: "I don't have enough information in your content to answer this question. Please upload some relevant content first.",
                        sources: [],
                        confidence: 0
                    };
                }
                const contextChunks = similarChunks.map(chunk => chunk.chunktext);
                const sources = similarChunks.map(chunk => chunk.source || 'Unknown source');
                const answer = yield this.geminiService.generateResponse(question, contextChunks);
                console.log('Response generated successfully');
                const confidence = this.calculateConfidence(similarChunks);
                return {
                    answer,
                    sources: [...new Set(sources)],
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
    calculateConfidence(similarChunks) {
        if (similarChunks.length > 0 && similarChunks[0].score !== undefined) {
            const avgScore = similarChunks.reduce((sum, chunk) => sum + (chunk.score || 0), 0) / similarChunks.length;
            return Math.min(avgScore, 1.0); // Normalize to 0-1
        }
        return Math.min(similarChunks.length / 5, 1.0);
    }
    deleteUserContent(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, pinecone_1.deleteUserChunks)(userId);
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
