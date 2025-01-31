import { GenerateStreamResponse, z } from "genkit";
import { NextRequest, NextResponse } from "next/server";
import { GenerateRequestSchema } from "./schema";
import { toReadableStream } from "./utils";
import { adminAuth, adminRtdb } from "./firebase-admin";

export type ChatHandler<T = z.infer<typeof GenerateRequestSchema>> = (
  data: T
) => GenerateStreamResponse<any> | Promise<GenerateStreamResponse<any>>;

export interface ChatEndpointOptions<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema?: T;
}

type Endpoint = (request: NextRequest) => Promise<NextResponse>;

function errorResponse(error: { message: string; status: number }) {
  return new NextResponse(JSON.stringify(error), {
    status: error.status,
    headers: { "content-type": "application/json" },
  });
}

async function checkRateLimit(uid: string): Promise<number> {
  const hourBucket = new Date().toISOString().substring(0, 13);
  let newValue: number = 0;
  const { committed, snapshot } = await adminRtdb
    .ref(`limits/${hourBucket}/${uid}`)
    .transaction((count) => {
      newValue = (count || 0) + 1;
      return newValue;
    });
  if (!committed) return 10000000;
  return snapshot.val();
}

const MAX_REQUESTS_HOURLY = parseInt(
  process.env.MAX_REQUESTS_HOURLY || "120",
  10
);

export default function genkitEndpoint(handler: ChatHandler): Endpoint;
export default function genkitEndpoint<T extends z.ZodTypeAny = z.ZodTypeAny>(
  options: ChatEndpointOptions<T>,
  handler: ChatHandler
): Endpoint;
export default function genkitEndpoint<T extends z.ZodTypeAny = z.ZodTypeAny>(
  optionsOrHandler: ChatEndpointOptions<T> | ChatHandler<z.infer<T>>,
  handler?: ChatHandler
): Endpoint {
  const options = handler ? (optionsOrHandler as ChatEndpointOptions) : {};
  handler = handler || (optionsOrHandler as ChatHandler);

  return async (request: NextRequest): Promise<NextResponse> => {
    const idToken = request.headers.get("authorization")?.split(" ")[1];
    if (!idToken) {
      return errorResponse({
        message: "You must be authenticated to make requests to demos.",
        status: 403,
      });
    }
    const { uid } = await adminAuth.verifyIdToken(idToken);
    const numRequests = await checkRateLimit(uid);
    console.log("UID:", uid, numRequests);
    if (numRequests > MAX_REQUESTS_HOURLY) {
      return errorResponse({
        status: 429,
        message:
          "You have reached your demo request limit for the hour. Come back later.",
      });
    }

    const schema = options.schema || GenerateRequestSchema;
    const data = schema.parse(await request.json());

    try {
      const response = await handler(data);
      return new NextResponse(toReadableStream(response), {
        headers: { "content-type": "text/event-stream" },
      });
    } catch (e) {
      return new NextResponse(
        `data: ${JSON.stringify({
          error: { message: (e as Error).message },
        })}\n\n`,
        {
          headers: { "content-type": "text/event-stream" },
        }
      );
    }
  };
}
