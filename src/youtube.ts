import axios from "axios";

/**
 * Sends a YouTube URL to the local Python microservice
 * to retrieve its English transcript.
 *
 * @param url - A valid YouTube video URL
 * @returns A string containing the full transcript
 */
export async function getTranscriptFromYoutubeURL(url: string): Promise<string> {
  try {
    const response = await axios.post("http://localhost:5001/transcript", { url });
    return response.data.transcript;
  } catch (err: any) {
    throw new Error(`Failed to fetch transcript: ${err.message}`);
  }
}

