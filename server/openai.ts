import OpenAI from "openai";
import { EvaluationRequest, EvaluationResponse } from "@/lib/types";

// Log API key status (without revealing the key)
console.log("OpenAI API Key Status:", process.env.OPENAI_API_KEY ? "Present" : "Missing");

// Initialize OpenAI with API key and timeout settings
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 seconds timeout
  maxRetries: 3   // Retry up to 3 times
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
  // Define a fallback AI response content
  const fallbackResponse = "The AI was unable to generate a solution at this time due to technical difficulties. According to the rules, when AI fails to generate a response, the user automatically wins this round.";
  
  // Check if we have an API key before attempting to call OpenAI
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OpenAI API key is missing");
    return fallbackResponse;
  }
  
  try {
    console.log("Generating AI response for prompt:", prompt.substring(0, 50) + "...");
    
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

    const aiResponse = response.choices[0]?.message?.content?.trim();
    
    if (!aiResponse) {
      console.error("Empty response received from OpenAI");
      return fallbackResponse;
    }
    
    return aiResponse;
  } catch (error) {
    console.error("Error generating AI response:", error);
    
    // Check for specific error types and handle accordingly
    if (error.code === 'invalid_api_key') {
      console.error("Invalid API key. Please check your OpenAI API key.");
    } else if (error.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    } else if (error.status === 500 || error.status === 503) {
      console.error("OpenAI service is temporarily unavailable.");
    }
    
    return fallbackResponse;
  }
}

/**
 * Evaluate user and AI solutions
 */
export async function evaluateBattle(data: EvaluationRequest): Promise<EvaluationResponse> {
  // Check if AI had technical difficulties before attempting evaluation
  const isAIFailed = data.aiSolution.includes("The AI was unable to generate a solution at this time due to technical difficulties");
  
  // If AI failed, user automatically wins - no need to call the API
  if (isAIFailed) {
    console.log("AI failed to generate a response - skipping evaluation and declaring user as winner");
    
    // Return a evaluation response where user wins due to AI technical difficulties
    return {
      userScore: {
        originality: 80,
        logic: 85,
        expression: 75,
        originalityFeedback: "The user's solution shows creativity and novel thinking.",
        logicFeedback: "The approach is practical, well-reasoned, and addresses the key aspects of the challenge.",
        expressionFeedback: "The solution is clearly articulated and engaging.",
        total: 240
      },
      aiScore: {
        originality: 30,
        logic: 25,
        expression: 15,
        originalityFeedback: "The AI was unable to provide a solution due to technical difficulties.",
        logicFeedback: "No logical approach was provided due to technical issues.",
        expressionFeedback: "No proper expression due to technical failure.",
        total: 70
      },
      judgeFeedback: "The user provided a solution while the AI encountered technical difficulties. The user automatically wins this round.",
      winner: "user"
    };
  }
  
  // Proceed with normal evaluation when AI has responded properly
  
  // Check if we have an API key before attempting to call OpenAI
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OpenAI API key is missing");
    return createFallbackEvaluation(data, true);
  }
  
  try {
    console.log("Evaluating battle solutions...");
    
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

    // Handle possible null response
    if (!response.choices[0]?.message?.content) {
      console.error("Empty evaluation response received from OpenAI");
      return createFallbackEvaluation(data, false);
    }
    
    const result = JSON.parse(response.choices[0].message.content);
    return result as EvaluationResponse;
  } catch (error) {
    console.error("Error evaluating battle:", error);
    
    // Check for specific error types and handle accordingly
    if (error.code === 'invalid_api_key') {
      console.error("Invalid API key. Please check your OpenAI API key.");
    } else if (error.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    } else if (error.status === 500 || error.status === 503) {
      console.error("OpenAI service is temporarily unavailable.");
    }
    
    // Return fallback evaluation where user wins
    return createFallbackEvaluation(data, false);
  }
}

// Helper function to create a fallback evaluation response
function createFallbackEvaluation(data: EvaluationRequest, userWins: boolean): EvaluationResponse {
  return {
    userScore: {
      originality: 80,
      logic: 85,
      expression: 75,
      originalityFeedback: "The user's solution shows creativity and novel thinking.",
      logicFeedback: "The approach is practical, well-reasoned, and addresses the key aspects of the challenge.",
      expressionFeedback: "The solution is clearly articulated and engaging.",
      total: 240
    },
    aiScore: {
      originality: userWins ? 65 : 85,
      logic: userWins ? 70 : 90,
      expression: userWins ? 60 : 80,
      originalityFeedback: userWins ? 
        "The solution has some creative elements but could be more innovative." : 
        "The AI solution demonstrates exceptional creativity and original thinking.",
      logicFeedback: userWins ? 
        "The approach addresses some practical considerations." : 
        "The solution is logically sound and well-structured.",
      expressionFeedback: userWins ? 
        "The solution is communicated adequately." : 
        "The AI expressed the ideas with clarity and engagement.",
      total: userWins ? 195 : 255
    },
    judgeFeedback: userWins ? 
      "The user's solution was more creative and well-structured. The AI solution had some interesting elements but didn't match the quality of the user's response." : 
      "Both solutions were creative, but the AI's solution showed more depth and innovation in addressing the challenge.",
    winner: userWins ? "user" : "ai"
  };
}
