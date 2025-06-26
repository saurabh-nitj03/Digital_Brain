import { ContentProcessor, ProcessedContent } from './contentProcessor';
import { GeminiService } from './gemini';
import { embedSentences, embedQuery } from './embed';
import { storeChunks, searchChunks, getUserChunks, deleteUserChunks } from './mongo';
import chunkText from './chunkText';

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

  /**
   * Process and store user content
   */
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
      console.log('Processing content for user:', userId);
      
      // Step 1: Process the content based on its type
      const processedContent = await ContentProcessor.processContent(content, contentType);
      console.log('Content processed successfully:', processedContent.type);

      // Step 2: Generate summary and keywords
      // const summary = await this.geminiService.generateSummary(processedContent.text);
      // const keywords = await this.geminiService.generateKeywords(processedContent.text);

      // Step 3: Chunk the text
      const chunks = await chunkText(processedContent.text);
      console.log(`Text chunked into ${chunks.length} pieces`);

      // Step 4: Generate embeddings for chunks
      const embedChunks = await embedSentences(chunks);
      console.log('Embeddings generated successfully');

      // Step 5: Add source and metadata information
      const chunksWithMetadata = embedChunks.map(chunk => ({
        ...chunk,
        source: processedContent.source,
        contentType: processedContent.type,
        metadata: {
          originalSource: processedContent.source,
          contentType: processedContent.type
        }
      }));

      // Step 6: Store chunks in MongoDB
      await storeChunks(userId, chunksWithMetadata);
      console.log('Chunks stored in database');

      return {
        success: true,
        message: `Content processed and stored successfully. Generated ${chunks.length} chunks.`,
        processedContent,
        // summary,
        // keywords
      };

    } catch (error) {
      console.error('Error processing and storing content:', error);
      return {
        success: false,
        message: `Failed to process content: ${error}`
      };
    }
  }

  /**
   * Query the AI agent with user questions
   */
  async queryAgent(userId: string, question: string): Promise<QueryResponse> {
    try {
      console.log('Processing query for user:', userId);
      console.log('Question:', question);

      // Step 1: Generate embedding for the query
      const queryEmbedding = await embedQuery(question);
      console.log('Query embedding generated');

      // Step 2: Search for similar chunks in the database
      const similarChunks = await searchChunks(userId, queryEmbedding, 5);
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
      const answer = await this.geminiService.generateResponse(question, contextChunks);
      console.log('Response generated successfully');

      // Step 5: Calculate confidence based on similarity scores
      const confidence = this.calculateConfidence(similarChunks);

      return {
        answer,
        sources: [...new Set(sources)], // Remove duplicates
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
  private calculateConfidence(similarChunks: any[]): number {
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