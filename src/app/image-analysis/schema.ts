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
  yMin: z
    .number()
    .describe(
      "the percent vertical position of the top of the object within the image (0 = top of image, 100 = bottom of image)"
    ),
  yMax: z
    .number()
    .describe(
      "the vertical position of the bottom of the object within the image"
    ),
  xMin: z
    .number()
    .describe(
      "the horizontal position of the top of the object within the image"
    ),
  xMax: z
    .number()
    .describe(
      "the horizontal position of the bottom of the object within the image"
    ),
});

export type ImageObject = z.infer<typeof ImageObjectSchema>;
