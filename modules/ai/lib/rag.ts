import { pineconeIndex } from "@/lib/pinecone";
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function generateEmbedding(text: string) {
  try {
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
      config: { outputDimensionality: 768 },
    });

    if (!response || !response.embeddings || response.embeddings.length === 0) {
      throw new Error("No embedding generated");
    }

    return response.embeddings[0].values;
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

    if (!embedding) {
      throw new Error("Failed to generate embedding for query");
    }

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
