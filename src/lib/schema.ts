import { z, MessageSchema, PartSchema } from "genkit";

export const GenerateRequestSchema = z.object({
  system: z.array(PartSchema).optional(),
  messages: z.array(MessageSchema).optional(),
  prompt: z.array(PartSchema).optional(),
});
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
