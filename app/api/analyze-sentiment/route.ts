import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables." },
        { status: 500 },
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (jsonErr) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 },
      );
    }
    const { comments, caption } = body || {};
    if (!Array.isArray(comments) || typeof caption !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'comments' or 'caption' in request body." },
        { status: 400 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze the sentiment of the following Instagram post caption and comments. Provide a detailed sentiment analysis in JSON format.

    Caption: "${caption}"

    Comments: ${JSON.stringify(comments.slice(0, 50))}

    Please analyze and return a JSON response with:
    {
      "positive": 65,
      "negative": 15,
      "neutral": 20,
      "overall": "positive",
      "score": 0.75,
      "topPositiveComments": [
        {"id": "1", "text": "Amazing content!", "username": "user1", "like_count": 5}
      ],
      "topNegativeComments": [
        {"id": "2", "text": "Not great", "username": "user2", "like_count": 0}
      ],
      "emotions": {
        "joy": 45,
        "anger": 10,
        "sadness": 5,
        "fear": 5,
        "surprise": 35
      }
    }

    Return only valid JSON without any markdown formatting or code blocks.
    `;

    let text = "";
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = await response.text();
    } catch (aiErr) {
      console.error("Error calling Gemini API:", aiErr);
      return NextResponse.json({
        positive: 55,
        negative: 25,
        neutral: 20,
        overall: "positive",
        score: 0.55,
        topPositiveComments: [],
        topNegativeComments: [],
        emotions: {
          joy: 35,
          anger: 20,
          sadness: 15,
          fear: 10,
          surprise: 20,
        },
        error: "Failed to call Gemini API. Returning mock data."
      }, { status: 502 });
    }

    // Clean up the response to ensure it's valid JSON
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    try {
      const sentimentData = JSON.parse(text);
      return NextResponse.json(sentimentData);
    } catch (parseError) {
      // If parsing fails, return mock data
      console.error("Failed to parse AI response, returning mock data:", parseError, "AI response was:", text);
      return NextResponse.json({
        positive: 60,
        negative: 20,
        neutral: 20,
        overall: "positive",
        score: 0.6,
        topPositiveComments: comments.slice(0, 3).map((c) => ({
          id: c.id,
          text: c.text,
          username: c.username,
          like_count: c.like_count,
        })),
        topNegativeComments: [],
        emotions: {
          joy: 40,
          anger: 15,
          sadness: 10,
          fear: 5,
          surprise: 30,
        },
        error: "Failed to parse AI response. Returning mock data."
      }, { status: 502 });
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    // Return mock data if API fails
    return NextResponse.json({
      positive: 55,
      negative: 25,
      neutral: 20,
      overall: "positive",
      score: 0.55,
      topPositiveComments: [],
      topNegativeComments: [],
      emotions: {
        joy: 35,
        anger: 20,
        sadness: 15,
        fear: 10,
        surprise: 20,
      },
      error: "Unexpected server error. Returning mock data."
    }, { status: 500 });
  }
}
