import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    const { contentData } = await request.json()

    // Analyze content and return mock data based on caption analysis
    const caption = contentData.caption.toLowerCase()

    let primaryCategory = "lifestyle"
    let confidence = 75

    if (caption.includes("food") || caption.includes("recipe") || caption.includes("cooking")) {
      primaryCategory = "food"
      confidence = 85
    } else if (caption.includes("fitness") || caption.includes("workout") || caption.includes("gym")) {
      primaryCategory = "fitness"
      confidence = 80
    } else if (caption.includes("travel") || caption.includes("vacation") || caption.includes("explore")) {
      primaryCategory = "travel"
      confidence = 82
    } else if (caption.includes("beauty") || caption.includes("makeup") || caption.includes("skincare")) {
      primaryCategory = "beauty"
      confidence = 88
    } else if (caption.includes("tech") || caption.includes("technology") || caption.includes("digital")) {
      primaryCategory = "tech"
      confidence = 78
    }

    const mockData = {
      primaryCategory: {
        name: primaryCategory,
        confidence: confidence,
        description: `This content is primarily focused on ${primaryCategory} themes and topics.`,
      },
      secondaryCategories: [
        { name: "entertainment", confidence: 45, relevance: 60 },
        { name: "inspiration", confidence: 38, relevance: 55 },
      ],
      contentThemes: [
        {
          theme: primaryCategory,
          strength: confidence,
          keywords: ["lifestyle", "content", "daily", "inspiration"],
        },
        {
          theme: "motivation",
          strength: 45,
          keywords: ["motivation", "success", "goals", "achievement"],
        },
      ],
      audienceInterests: [
        { interest: primaryCategory, engagement: 75, comments: 45 },
        { interest: "inspiration", engagement: 60, comments: 28 },
        { interest: "motivation", engagement: 55, comments: 22 },
      ],
      contentStyle: {
        type: "inspirational",
        tone: "friendly",
        format: contentData.video_url ? "video" : "image",
      },
      recommendations: [
        `Continue focusing on ${primaryCategory} content as it resonates well`,
        "Add more interactive elements to boost engagement",
        "Consider creating series or themed content",
        "Use trending audio for video content",
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error analyzing content category:", error)
    return NextResponse.json({ error: "Failed to analyze content category" }, { status: 500 })
  }
}
