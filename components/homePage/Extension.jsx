"use client";
import Chat from "vizolv-extension";
import {
  metadataVideo1,
  transcriptVideo1,
  rawTranscriptVideo1,
} from "@/lib/data/youtube/video1";
export default function Extension() {
  const data = {
    info: {
      metadata: metadataVideo1,
      transcript: transcriptVideo1,
    },
    rawTranscript: rawTranscriptVideo1,
  };
  console.log("data", data);
  return (
    <div>
      <Chat {...data} />
    </div>
  );
}
