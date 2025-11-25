/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

// Helper to generate dynamic image URL using Pollinations.ai
function generateImage(prompt: string): string {
  const encodedPrompt = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}`;
}

export async function identifyPlant(base64Image: string) {
  try {
    // Remove the data URL prefix
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Please analyze this plant image and provide information in the following JSON format:
              {
                "name": "plant name",
                "description": "brief description of the plant",
                "careInstructions": ["instruction1", "instruction2", "instruction3"],
                "similarPlants": [
                  { "name": "similar plant name", "imagePrompt": "visual description of similar plant" }
                ]
              }`
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: imageData
              }
            }
          ]
        }
      ]
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    if (isJSON(cleanedText)) {
      const plantData = JSON.parse(cleanedText);

      // Generate images for similar plants
      if (plantData.similarPlants) {
        plantData.similarPlants = plantData.similarPlants.map((plant: any) => ({
          name: plant.name,
          image: generateImage(`${plant.name} plant ${plant.imagePrompt || ''} realistic high quality`)
        }));
      }

      return {
        name: plantData.name || 'Unknown Plant',
        description: plantData.description || 'No description available.',
        careInstructions: plantData.careInstructions || ['No care instructions provided.'],
        similarPlants: plantData.similarPlants || [],
      };
    } else {
      return {
        name: 'Plant Analysis',
        description: text,
        careInstructions: ['Please refer to the description for more details.'],
        similarPlants: []
      };
    }
  } catch (error) {
    console.error('Error identifying plant:', error);
    return {
      name: 'Error',
      description: 'Unable to identify the plant at this time. Please try again.',
      careInstructions: ['Please try uploading the image again.'],
      similarPlants: []
    };
  }
}

// Utility function to check if a string is valid JSON
function isJSON(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

export async function getChatResponse(message: string, plantInfo: any) {
  try {
    // Using gemini-2.5-flash for chat
    // Note: The new SDK chat API might differ slightly, but generateContent works for single turn
    // For multi-turn chat, we need to maintain history manually or use the chat helper if available
    // The google-genai SDK has a simpler interface, let's use generateContent with history context for now

    const history = [
      { role: 'user', parts: [{ text: `I have a ${plantInfo.name}. Here's what I know about it: ${plantInfo.description}` }] },
      { role: 'model', parts: [{ text: "I'll help you with any questions about your plant." }] },
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: history,
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error getting chat response:', error);
    return 'Sorry, an error occurred while processing your request.';
  }
}

// Add a function to search for plants based on user input
export async function searchPlants(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Search for plants based on the following query and return a JSON response with relevant results.
              
              IMPORTANT: If the query is a general plant type (e.g., 'Rose', 'Fern', 'Cactus'), provide a list of 3-5 popular varieties or types of that plant as separate entries.
              
              For each plant, provide:
              - name (specific variety name if applicable)
              - description
              - careInstructions: an array of 3 brief care tips
              - similarPlants: an array of 2-3 similar plants, each with "name" and "imagePrompt" (a short visual description for image generation)
              
              Format:
              {
                "plants": [
                  { 
                    "name": "plant name", 
                    "description": "short description", 
                    "careInstructions": ["tip 1", "tip 2", "tip 3"],
                    "similarPlants": [
                      { "name": "similar plant name", "imagePrompt": "visual description of similar plant" }
                    ]
                  }
                ]
              }
              Query: ${query}`
            }
          ]
        }
      ]
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    if (isJSON(cleanedText)) {
      const data = JSON.parse(cleanedText);
      const plants = data.plants || [];

      // Enhance plants with generated images
      const enhancedPlants = plants.map((plant: any) => {
        // Generate main image
        const mainImage = generateImage(`${plant.name} plant realistic high quality`);

        // Generate images for similar plants
        const similarPlantsWithImages = (plant.similarPlants || []).map((similar: any) => ({
          name: similar.name,
          image: generateImage(`${similar.name} plant ${similar.imagePrompt || ''} realistic`)
        }));

        return {
          ...plant,
          image: mainImage,
          similarPlants: similarPlantsWithImages
        };
      });

      return enhancedPlants;
    } else {
      console.warn('Response is not JSON. Returning as plain text.');
      // Fallback for non-JSON response
      return [{
        name: query,
        description: cleanedText,
        image: generateImage(`${query} plant realistic`),
        careInstructions: [],
        similarPlants: []
      }];
    }
  } catch (error) {
    console.error('Error searching plants:', error);
    return [];
  }
}