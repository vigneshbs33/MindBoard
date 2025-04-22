import OpenAI from "openai";
import { EvaluationRequest, EvaluationResponse } from "@/lib/types";

// Initialize OpenAI with API key
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

/**
 * Generate a creative prompt for a battle
 */
export async function generatePrompt(): Promise<string> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a creativity coach who creates thought-provoking creative challenges. Generate ONE creative prompt that would make for an interesting 3-minute creativity battle. The prompt should be open-ended enough to allow for multiple approaches but specific enough to provide direction. Don't include any additional text, just the prompt itself." 
        }
      ],
      temperature: 0.9,
      max_tokens: 100
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating prompt:", error);
    // Fallback prompts in case the API fails
    const fallbackPrompts = [
      "Design a flying classroom that can travel anywhere in the world",
      "Create a device that helps people remember their dreams",
      "Invent a new sport that combines three existing sports",
      "Design a restaurant concept for the year 2050",
      "Create a new musical instrument that uses unconventional materials",
      "Design a sustainable home that could exist in extreme weather conditions",
      "Invent a new holiday and its traditions",
      "Create a transportation system for a city built underwater",
      "Design a device that translates animal communication into human language",
      "Create a new form of art that engages all five senses"
    ];
    
    return fallbackPrompts[Math.floor(Math.random() * fallbackPrompts.length)];
  }
}

/**
 * Generate an AI response to a prompt
 */
export async function generateAIResponse(prompt: string): Promise<string> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a creative problem solver participating in a creativity battle. You will be given a creative prompt and must provide an innovative, logical, and well-expressed solution. Your solution should be original, practical, and clearly communicated. Aim for approximately 150-250 words." 
        },
        {
          role: "user",
          content: `Creative challenge: ${prompt}`
        }
      ],
      temperature: 0.8,
      max_tokens: 500
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "The AI was unable to generate a solution at this time due to technical difficulties.";
  }
}

/**
 * Evaluate user and AI solutions
 */
export async function evaluateBattle(data: EvaluationRequest): Promise<EvaluationResponse> {
  try {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: `You are an impartial judge in a creativity battle. You'll evaluate two solutions to a creative prompt based on:
          
          1. Originality (0-100): Novelty, uniqueness, and innovation
          2. Logic (0-100): Feasibility, practicality, and coherence
          3. Expression (0-100): Clarity, engagement, and communication quality
          
          Provide detailed feedback for each category for both solutions. Calculate a total score for each participant (sum of the three scores). Determine the winner based on total score. If scores are tied, choose the solution with higher originality.
          
          Output your evaluation as a JSON object with this format:
          {
            "userScore": {
              "originality": number,
              "logic": number,
              "expression": number,
              "originalityFeedback": string,
              "logicFeedback": string,
              "expressionFeedback": string,
              "total": number
            },
            "aiScore": {
              "originality": number,
              "logic": number,
              "expression": number,
              "originalityFeedback": string,
              "logicFeedback": string,
              "expressionFeedback": string,
              "total": number
            },
            "judgeFeedback": string,
            "winner": "user" or "ai"
          }`
        },
        {
          role: "user",
          content: `
          Prompt: ${data.prompt}
          
          User solution:
          ${data.userSolution}
          
          AI solution:
          ${data.aiSolution}
          
          Please evaluate both solutions fairly and provide your judgment.`
        }
      ],
      temperature: 0.2,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);
    return result as EvaluationResponse;
  } catch (error) {
    console.error("Error evaluating battle:", error);
    
    // Return a fallback evaluation response
    return {
      userScore: {
        originality: 70,
        logic: 75,
        expression: 65,
        originalityFeedback: "The solution shows good creativity with some novel ideas.",
        logicFeedback: "The approach is generally practical and well-reasoned.",
        expressionFeedback: "The solution is communicated clearly with room for improvement.",
        total: 210
      },
      aiScore: {
        originality: 65,
        logic: 80,
        expression: 70,
        originalityFeedback: "The solution incorporates familiar concepts with some creative twists.",
        logicFeedback: "The approach is very practical and addresses key challenges.",
        expressionFeedback: "The solution is well-articulated and engaging.",
        total: 215
      },
      judgeFeedback: "Both solutions presented interesting approaches to the prompt. The AI solution had a slight edge in overall feasibility and expression, though the user solution showed more original thinking.",
      winner: "ai"
    };
  }
}
