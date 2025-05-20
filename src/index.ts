import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { getTranscriptFromYoutubeURL } from "./youtube";
import { summarizeText } from "./summarizer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

type SummarizeRequestBody = {
  url: string;
  level: string;
  apiKey: string;
};

app.post("/summarize", async (req, res) => {

  const { url, level, apiKey } = req.body;

  // 🔐 API Key check
  if ((apiKey || "").trim() !== (process.env.chuckApi || "").trim()) {
    res.status(403).json({ error: "Invalid API key" });
    return;
  }

  try {
    console.log("📺 Fetching transcript...");
    const transcript = await getTranscriptFromYoutubeURL(url);

    console.log("🧠 Summarizing with level:", level);
    const summary = await summarizeText(transcript, level);

    res.json({ summary });
  } catch (err: any) {
    console.error("❌ Error during summarization:", err.message);
    res.status(500).json({ error: err.message });
  }
});



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
