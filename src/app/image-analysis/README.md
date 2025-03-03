# Image Analysis

By combining multimodal image input with structured output, Genkit can provide detailed analysis of images and even provide rough bounding boxes for the images.

This example takes an arbitrary image and analyzes it to identify objects and draw a colored bounding box around them.

**Note:** When Gemini "sees" an image it normalizes it into a 1000x1000 square. So when extracting bounding boxes, you'll need to adjust the results to suit the actual dimensions of the uploaded image.

## Things to Try

- Try the sample images, or upload one of your own!
- Change the system prompt to `Identify ONLY plants in the provided image.` then try it with the bluebird picture.

##
