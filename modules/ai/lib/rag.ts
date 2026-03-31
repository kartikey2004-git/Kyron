import { pineconeIndex } from "@/lib/pinecone";
import { InferenceClient } from "@huggingface/inference";

export const hfClient = new InferenceClient(
  process.env.HUGGINGFACE_API_TOKEN || "",
);

// Hugging Face embedding model configuration

const HF_EMBEDDING_MODEL = "sentence-transformers/all-mpnet-base-v2";

export async function generateEmbedding(text: string) {
  try {
    const embedding = await hfClient.featureExtraction({
      model: HF_EMBEDDING_MODEL,
      inputs: text,
      dimensions: 768,
    });

    let embeddingArray: number[];

    if (Array.isArray(embedding) && embedding.length > 0) {
      if (Array.isArray(embedding[0])) {
        embeddingArray = embedding[0] as number[];
      } else {
        embeddingArray = embedding as number[];
      }
    } else {
      throw new Error("Unexpected embedding format");
    }

    return embeddingArray;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}

export async function indexCodebase(
  repoId: string,
  files: { path: string; content: string }[],
) {
  const vectors = [];

  for (const file of files) {
    const content = `File: ${file.path}\n\n${file.content}`;

    const truncatedContent = content.slice(0, 8000);

    try {
      const embedding = await generateEmbedding(truncatedContent);

      if (!embedding || embedding.length === 0) {
        console.warn(`Empty embedding generated for ${file.path}`);
        continue;
      }

      vectors.push({
        id: `${repoId}/${file.path.replace(/\//g, "-")}`,
        values: embedding,
        metadata: {
          path: file.path,
          repoId,
          content: truncatedContent,
          size: truncatedContent.length,
        },
      });
    } catch (error) {
      console.error(`Error generating embedding for ${file.path}:`, error);
    }
  }

  if (vectors.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await pineconeIndex.upsert({ records: batch });
    }
    console.log(`Indexed ${vectors.length} vectors for repo ${repoId}`);
  }
}

export async function retrieveContext(
  repoId: string,
  query: string,
  topK: number = 5,
) {
  try {
    const embedding = await generateEmbedding(query);

    const results = await pineconeIndex.query({
      vector: embedding,
      topK: topK,
      filter: {
        repoId: repoId,
      },
      includeMetadata: true,
    });

    const context = results.matches
      .map((match) => match.metadata?.content as string)
      .filter(Boolean);

    return context;
  } catch (error) {
    console.error("Error retrieving context:", error);
    return [];
  }
}