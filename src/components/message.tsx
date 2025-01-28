import { compactParts } from "@/lib/utils";
import type { MessageData, Part } from "genkit";

export function renderPart(part: Part) {
  // if (part.text) return <TextPart text={part.text}/>;
  // if (part.media) return <MediaPart
  return <></>;
}

export default function Message(message: MessageData) {
  return compactParts(message.content).map((part, i) => {
    <div key={i}>{renderPart(part)}</div>;
  });
}
