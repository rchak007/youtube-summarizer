from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi

app = Flask(__name__)
CORS(app)

@app.route('/transcript', methods=['POST'])
def get_transcript():
    try:
        data = request.get_json()
        url = data.get("url")
        video_id = extract_video_id(url)

        print(f"[📺] Fetching transcript for video ID: {video_id}")

        if not video_id:
            return jsonify({"error": "Invalid YouTube URL"}), 400

        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = " ".join([line["text"] for line in transcript])

        print("[✅] Transcript fetched successfully.")
        return jsonify({"transcript": full_text})

    except Exception as e:
        print("[❌] Error while fetching transcript:", str(e))
        return jsonify({"error": str(e)}), 500

def extract_video_id(url):
    import re
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", url)
    return match.group(1) if match else None

if __name__ == "__main__":
    app.run(port=5001)
