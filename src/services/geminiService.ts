import { GoogleGenAI } from "@google/genai";

export async function visualizeRenovation(imageBase64: string, style: string, mimeType: string = 'image/jpeg') {
  // Instantiate inside the function to use the latest environment variables
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  const model = "gemini-2.5-flash-image";
  
  const prompt = `
    You are an expert interior designer for high-end London properties.
    I am providing a photo of a room. Please re-imagine this room in a "${style}" style.
    
    TASK:
    1. Generate a high-quality visualization image of this room renovated in the "${style}" style.
    2. Provide a detailed design proposal in Markdown describing the changes to flooring, walls, lighting, and furniture.
    
    Keep the architectural integrity of the room. Return your response with both the image and the text description.
  `;

  const imagePart = {
    inlineData: {
      mimeType: mimeType,
      data: imageBase64,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, { text: prompt }] },
    });

    let text = "";
    let generatedImageUrl = null;

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          text += part.text;
        } else if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    // Fallback for text if parts parsing was incomplete
    if (!text && response.text) {
      text = response.text;
    }

    return { text, generatedImageUrl };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
