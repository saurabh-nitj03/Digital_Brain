import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface EmbeddingResult {
  chunk: string;
  embedding: number[];
}

export async function embedSentences(sentences: string[]): Promise<EmbeddingResult[]> {
  const output = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: sentences,
  });

  if (!Array.isArray(output) || !Array.isArray(output[0])) {
    throw new Error('Unexpected output from Hugging Face Inference API');
  }

  return sentences.map((chunk, i) => ({
    chunk,
    embedding: output[i] as number[],
  }));
}

export async function embedQuery(query: string): Promise<number[]> {
  const output = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: query,
  });

  if (!Array.isArray(output) || Array.isArray(output[0])) {
    throw new Error('Unexpected output from Hugging Face Inference API');
  }

  return output as number[];
}

// Commented out the old local model code below for reference
// ... existing code ...
