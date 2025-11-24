import { GoogleGenAI } from "@google/genai";
import { AppData } from "../types";

let aiClient: GoogleGenAI | null = null;

// Initialize client if key exists
if (process.env.API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const sendMessageToGemini = async (userMessage: string, appData: AppData): Promise<string> => {
  if (!aiClient) {
    return "API Key not configured. Please check your environment variables.";
  }

  try {
    // We provide the current state of the inventory as system context
    // This allows the model to answer specific questions about the data.
    const context = `
      You are an intelligent inventory assistant for "The Cappuccino Connection".
      
      Here is the current live data state in JSON format:
      ${JSON.stringify({
        inventory: appData.current_inventory,
        predictions: appData.prediction_output,
        recent_invoices: appData.invoices.slice(0, 5),
        products: appData.products
      })}

      Rules:
      1. Answer the user's question based strictly on this data.
      2. If suggesting reorders, quote the specific product ID and quantity.
      3. Be concise and professional.
      4. If asked to draft an email, format it properly.
    `;

    const model = aiClient.models;
    
    // Using 2.5-flash for speed
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: context,
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};