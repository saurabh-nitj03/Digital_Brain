import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';
// import { EmbeddingResult } from "./embed";

interface ChunkData {
  chunk: string;
  embedding: number[];
  source?: string;
  contentType?: string;
  metadata?: any;
}

// Pinecone client setup
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const index = pinecone.Index(process.env.PINECONE_INDEX!);

// Store (upsert) chunks as vectors in Pinecone
async function storeChunks(userId: string, embedChunks: ChunkData[]) {
  try {
    const vectors = embedChunks.map((item) => ({
      id: uuidv4(),
      values: item.embedding,
      metadata: {
        userId,
        chunktext: item.chunk,
        source: item.source || 'Unknown',
        contentType: item.contentType || 'text',
        ...item.metadata,
      },
    }));
    await index.upsert(vectors);
    console.log(`Upserted ${vectors.length} vectors for user ${userId}`);
    return vectors;
  } catch (error) {
    console.error('Error storing chunks in Pinecone:', error);
    throw error;
  }
}

// Search for similar vectors in Pinecone
async function searchChunks(userId: string, questionEmbedding: number[], topk: number = 10) {
  try {
    const result = await index.query({
      vector: questionEmbedding,
      topK: topk,
      filter: { userId },
      includeMetadata: true,
    });
    // Map Pinecone results to expected format
    const matches = result.matches?.map((match: any) => ({
      chunktext: match.metadata.chunktext,
      source: match.metadata.source,
      contentType: match.metadata.contentType,
      metadata: match.metadata,
      score: match.score,
    })) || [];
    console.log(`Found ${matches.length} similar chunks for user ${userId}`);
    return matches;
  } catch (error) {
    console.error('Error searching chunks in Pinecone:', error);
    throw error;
  }
}

// Pinecone does not support listing all vectors for a user directly
async function getUserChunks(userId: string) {
  // Not directly supported; would require maintaining a separate metadata DB or using Pinecone's metadata filtering with a scan (not recommended for large datasets)
  console.warn('getUserChunks is not implemented for Pinecone.');
  return [];
}

// Delete all vectors for a user in Pinecone
async function deleteUserChunks(userId: string) {
  // Pinecone does not support batch delete by metadata; you must track IDs or use a metadata scan (not recommended for large datasets)
  console.warn('deleteUserChunks is not implemented for Pinecone.');
  return { deletedCount: 0 };
}

export { storeChunks, searchChunks, getUserChunks, deleteUserChunks };