import { Pinecone } from '@pinecone-database/pinecone';
import { v4 as uuidv4 } from 'uuid';

interface ChunkData {
  chunk: string;
  embedding: number[];
  source?: string;
  contentType?: string;
  metadata?: any;
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});
const index = pinecone.Index(process.env.PINECONE_INDEX!);

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

async function searchChunks(userId: string, questionEmbedding: number[], topk: number = 10) {
  try {
    const result = await index.query({
      vector: questionEmbedding,
      topK: topk,
      filter: { userId },
      includeMetadata: true,
    });
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

async function getUserChunks(userId: string) {
  console.warn('getUserChunks is not implemented for Pinecone.');
  return [];
}

async function deleteUserChunks(userId: string) {
  console.warn('deleteUserChunks is not implemented for Pinecone.');
  return { deletedCount: 0 };
}

export { storeChunks, searchChunks, getUserChunks, deleteUserChunks };