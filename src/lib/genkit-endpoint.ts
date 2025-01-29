import { GenerateStreamResponse, z } from "genkit";
import { NextRequest, NextResponse } from "next/server";
import { GenerateRequestSchema } from "./schema";
import { toReadableStream } from "./utils";

export type ChatHandler<T = z.infer<typeof GenerateRequestSchema>> = (
  data: T
) => GenerateStreamResponse<any>;

export interface ChatEndpointOptions<T extends z.ZodTypeAny = z.ZodTypeAny> {
  schema?: T;
}

type Endpoint = (request: NextRequest) => Promise<NextResponse>;

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
    const schema = options.schema || GenerateRequestSchema;
    const data = schema.parse(await request.json());
    const response = await handler(data);

    return new NextResponse(toReadableStream(response), {
      headers: { "content-type": "text/event-stream" },
    });
  };
}
