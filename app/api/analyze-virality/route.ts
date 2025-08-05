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

    const { postData } = await request.json()

    const engagementRate = ((postData.like_count + postData.comment_count) / Math.max(postData.view_count, 1)) * 100
    const reachRate = (postData.view_count / postData.followers) * 100

    // Calculate virality score based on metrics
    let viralityScore = 0
    viralityScore += Math.min(engagementRate * 2, 40) // Max 40 points for engagement
    viralityScore += Math.min(reachRate / 2, 30) // Max 30 points for reach
    viralityScore += Math.min(postData.comments.length / 10, 20) // Max 20 points for comments
    viralityScore += Math.min(postData.caption.length / 50, 10) // Max 10 points for caption length

    viralityScore = Math.min(Math.round(viralityScore), 100)

    let viralityLevel = "low"
    if (viralityScore >= 80) viralityLevel = "viral"
    else if (viralityScore >= 60) viralityLevel = "high"
    else if (viralityScore >= 40) viralityLevel = "medium"

    const mockData = {
      viralityScore: viralityScore,
      viralityLevel: viralityLevel,
      factors: [
        {
          factor: "Engagement Rate",
          impact: engagementRate > 5 ? 15 : engagementRate > 2 ? 5 : -10,
          status: engagementRate > 5 ? "positive" : engagementRate > 2 ? "neutral" : "negative",
          description: `Current engagement rate is ${engagementRate.toFixed(2)}%`,
        },
        {
          factor: "Reach Beyond Followers",
          impact: reachRate > 100 ? 20 : reachRate > 50 ? 10 : -5,
          status: reachRate > 100 ? "positive" : reachRate > 50 ? "neutral" : "negative",
          description: `Post reached ${reachRate.toFixed(1)}% of follower base`,
        },
        {
          factor: "Comment Activity",
          impact: postData.comments.length > 50 ? 15 : postData.comments.length > 20 ? 5 : -5,
          status: postData.comments.length > 50 ? "positive" : postData.comments.length > 20 ? "neutral" : "negative",
          description: `Generated ${postData.comments.length} comments`,
        },
      ],
      predictions: {
        reach: Math.min(reachRate * 1.5, 100),
        engagement: Math.min(engagementRate * 1.2, 100),
        shareability: Math.min(viralityScore * 0.8, 100),
        longevity: Math.min(viralityScore * 0.6, 100),
      },
      recommendations: [
        viralityScore < 50 ? "Focus on creating more engaging content" : "Maintain current content quality",
        "Post during peak audience hours",
        "Use trending hashtags and sounds",
        "Encourage comments with questions",
        "Create shareable, relatable content",
      ],
      riskFactors:
        viralityScore < 40
          ? ["Low engagement rate may limit reach", "Content may not be resonating with audience"]
          : [],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error analyzing virality:", error)
    return NextResponse.json({ error: "Failed to analyze virality" }, { status: 500 })
  }
}
