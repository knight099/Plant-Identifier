/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
// import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function identifyPlant(base64Image: string) {
  try {
    // Updated to use gemini-1.5-flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Remove the data URL prefix (e.g., 'data:image/jpeg;base64,')
    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Please analyze this plant image and provide information in the following JSON format:
              {
                "name": "plant name",
                "description": "brief description of the plant",
                "careInstructions": ["instruction1", "instruction2", "instruction3"]
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

    const response = await result.response;
    const text = await response.text();

    // console.debug('Raw AI Response:', response);
    const cleanedText = text
      .replace(/```json/g, '') // Remove ```json
      .replace(/```/g, '') // Remove closing ```
      .trim()

    // Check if the response is JSON
    if (isJSON(cleanedText)) {
      const plantData = JSON.parse(cleanedText);
      console.debug('Plant Data:', plantData);
      return {
        name: plantData.name || 'Unknown Plant',
        description: plantData.description || 'No description available.',
        careInstructions: plantData.careInstructions || ['No care instructions provided.'],
      };
    } else {
      console.warn('Response is not JSON. Returning as plain text.');
      return {
        name: 'Plant Analysis',
        description: text,
        careInstructions: ['Please refer to the description for more details.']
      };
    }
  } catch (error) {
    console.error('Error identifying plant:', error);
    return {
      name: 'Error',
      description: 'Unable to identify the plant at this time. Please try again.',
      careInstructions: ['Please try uploading the image again.']
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
  //   try {
    // Using gemini-1.5-flash for chat as well for consistency
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: `I have a ${plantInfo.name}. Here's what I know about it: ${plantInfo.description}` }]
      },
      {
        role: 'model',
        parts: [{ text: "I'll help you with any questions about your plant." }]
      }
    ]
  });
  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      // Server responded with a status other than 200 range
      console.error('Server error:', error.response.status, error.response.data);
      return `Sorry, there was a server error: ${error.response.status}`;
    } else if (isAxiosError(error) && error.request) {
      // Request was made but no response was received
      console.error('Network error:', error.request);
      return 'Sorry, there was a network error. Please check your connection and try again.';
    } else if (error instanceof Error) {
      // Something else happened
      console.error('Error:', error.message);
      return `Sorry, an error occurred: ${error.message}`;
    } else {
      console.error('Unexpected error:', error);
      return 'Sorry, an unexpected error occurred.';
    }

    function isAxiosError(error: any): error is import('axios').AxiosError {
      return error.isAxiosError === true;
    }
  }
}

// Add a function to search for plants based on user input
export async function searchPlants(query: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Search for plants based on the following query and return a JSON response with relevant results:
              {
                "plants": [
                  { "name": "plant name", "description": "short description", "image": "image URL" },
                ]
              }
              Query: ${query}`
            }
          ]
        }
      ]
    });

    const response = await result.response;
    const text = await response.text();

    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    console.debug('Plant Data:', cleanedText);
    if (isJSON(cleanedText)) {
      return JSON.parse(cleanedText).plants || [];
    } else {
      console.warn('Response is not JSON. Returning as plain text.');
      return {
        name: 'Search Result',
        description: cleanedText,
        image: 'https://via.placeholder.com/400'
      };
    }
  } catch (error) {
    console.error('Error searching plants:', error);
    return [];
  }
}