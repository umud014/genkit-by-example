import { z } from "genkit";

export const ImageObjectSchema = z.object({
  name: z.string().describe("a short but unique name of the object"),
  description: z
    .string()
    .describe("a single sentence detailed description of the object"),
  text: z.string().describe("any written text on the object").nullish(),
  colors: z
    .array(z.string())
    .describe(
      "a list of one or more valid CSS named colors that make up the object, from most to least prevalent"
    ),
  box2d: z
    .array(z.number())
    .describe("bounding box for the object in [y1,x1,y2,x2] format"),
});

export type ImageObject = z.infer<typeof ImageObjectSchema>;
