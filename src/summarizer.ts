import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function splitTextIntoChunks(text: string, chunkSizeWords: number = 3000): string[] {
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSizeWords) {
    chunks.push(words.slice(i, i + chunkSizeWords).join(" "));
  }

  return chunks;
}

export async function summarizeText(text: string, level: string): Promise<string> {
  const model = "gpt-3.5-turbo-16k";
  const isDeep = level === "deep";

  const chunks = splitTextIntoChunks(text, 3000);

  const summaries: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunkPrompt = isDeep
      ? `Deep dive summarize this part of a long YouTube transcript:\n\n${chunks[i]}`
      : `Summarize in 5–7 concise bullet points:\n\n${chunks[i]}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: chunkPrompt }],
      max_tokens: 1000,
    });

    summaries.push(`🔹 **Chunk ${i + 1} Summary:**\n${response.choices[0].message.content}`);
  }

  // Optional: You could re-summarize the summaries here in another GPT call

  return summaries.join("\n\n");
}
