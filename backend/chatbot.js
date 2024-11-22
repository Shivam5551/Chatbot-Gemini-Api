import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const main = async ({ prompt }) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is missing from the environment");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error("Error in generative AI call:", error);
    throw new Error("Failed to generate content");
  }
}
