import { MessageSchema, PartSchema, z } from "genkit";

export const SimpleChatbotRequestSchema = z.object({
  system: z.string().optional(),
  history: z.array(MessageSchema).default([]),
  content: z.array(PartSchema),
});
export type SimpleChatbotRequest = z.infer<typeof SimpleChatbotRequestSchema>;
