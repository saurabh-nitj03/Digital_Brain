import { ContentProcessor, ProcessedContent } from './contentProcessor';
import { GeminiService } from './gemini';
import { embedSentences, embedQuery } from './embed';
import { storeChunks, searchChunks, getUserChunks, deleteUserChunks } from './pinecone';
import chunkText from './chunkText';
import fs from 'fs';

export interface QueryResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

export class AIAgent {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }
  async processAndStoreContent(
    userId: string, 
    content: string | Buffer, 
    contentType?: string
  ): Promise<{
    success: boolean;
    message: string;
    processedContent?: ProcessedContent;
    summary?: string;
    keywords?: string[];
  }> {
    try {
      // --- Legacy: Only supported buffer or string (commented out) ---
      // const processedContent = await ContentProcessor.processContent(content, contentType);
      // const chunks = await chunkText(processedContent.text);
      // const embedChunks = await embedSentences(chunks);
      // const chunksWithMetadata = embedChunks.map(chunk => ({
      //   ...chunk,
      //   source: processedContent.source,
      //   contentType: processedContent.type,
      //   metadata: {
      //     originalSource: processedContent.source,
      //     contentType: processedContent.type
      //   }
      // }));
      // await storeChunks(userId, chunksWithMetadata);

      // --- New: Support for multer disk storage (file.path) ---
      let processedContent: ProcessedContent;
      if (typeof content === 'string' && contentType && fs.existsSync(content)) {
        // If content is a file path, read as buffer
        const fileBuffer = fs.readFileSync(content);
        processedContent = await ContentProcessor.processContent(fileBuffer, contentType);
      } else {
        processedContent = await ContentProcessor.processContent(content, contentType);
      }

      const chunks = await chunkText(processedContent.text);
      const embedChunks = await embedSentences(chunks);
      const chunksWithMetadata = embedChunks.map(chunk => ({
        ...chunk,
        source: processedContent.source,
        contentType: processedContent.type,
        metadata: {
          originalSource: processedContent.source,
          contentType: processedContent.type
        }
      }));
      await storeChunks(userId, chunksWithMetadata);

      return {
        success: true,
        message: `Content processed and stored successfully. Generated ${chunks.length} chunks.`,
        processedContent,
      };

    } catch (error) {
      console.error('Error processing and storing content:', error);
      return {
        success: false,
        message: `Failed to process content: ${error}`
      };
    }
  }


  async queryAgent(userId: string, question: string): Promise<QueryResponse> {
    try {
      const queryEmbedding = await embedQuery(question);
      const similarChunks = await searchChunks(userId, queryEmbedding, 5);
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
      const answer = await this.geminiService.generateResponse(question, contextChunks);
      console.log('Response generated successfully');
      const confidence = this.calculateConfidence(similarChunks);

      return {
        answer,
        sources: [...new Set(sources)],
        confidence
      };

    } catch (error) {
      console.error('Error querying agent:', error);
      return {
        answer: `Sorry, I encountered an error while processing your question: ${error}`,
        sources: [],
        confidence: 0
      };
    }
  }

  
  private calculateConfidence(similarChunks: any[]): number {
    if (similarChunks.length > 0 && similarChunks[0].score !== undefined) {
      const avgScore = similarChunks.reduce((sum, chunk) => sum + (chunk.score || 0), 0) / similarChunks.length;
      return Math.min(avgScore, 1.0); // Normalize to 0-1
    }
    
    return Math.min(similarChunks.length / 5, 1.0);
  }

  
  async deleteUserContent(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const result = await deleteUserChunks(userId);
      return {
        success: true,
        message: `Successfully deleted ${result.deletedCount} chunks`
      };
    } catch (error) {
      console.error('Error deleting user content:', error);
      return {
        success: false,
        message: `Failed to delete user content: ${error}`
      };
    }
  }
} 