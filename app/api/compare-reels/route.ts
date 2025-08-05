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

    const { reel1, reel2 } = await request.json()

    // Calculate metrics for both reels
    const reel1Engagement = ((reel1.like_count + reel1.comment_count) / Math.max(reel1.view_count, 1)) * 100
    const reel2Engagement = ((reel2.like_count + reel2.comment_count) / Math.max(reel2.view_count, 1)) * 100

    const reel1Reach = reel1.followers ? (reel1.view_count / reel1.followers) * 100 : 50
    const reel2Reach = reel2.followers ? (reel2.view_count / reel2.followers) * 100 : 50

    const mockData = {
      reel1: {
        username: reel1.username || "User 1",
        likes: reel1.like_count,
        comments: reel1.comment_count,
        views: reel1.view_count,
      },
      reel2: {
        username: reel2.username || "User 2",
        likes: reel2.like_count,
        comments: reel2.comment_count,
        views: reel2.view_count,
      },
      comparison: {
        engagement: {
          reel1: reel1Engagement,
          reel2: reel2Engagement,
          winner: reel1Engagement > reel2Engagement ? "reel1" : reel2Engagement > reel1Engagement ? "reel2" : "tie",
        },
        reach: {
          reel1: reel1Reach,
          reel2: reel2Reach,
          winner: reel1Reach > reel2Reach ? "reel1" : reel2Reach > reel1Reach ? "reel2" : "tie",
        },
        sentiment: {
          reel1: 7.5,
          reel2: 6.8,
          winner: "reel1",
        },
        virality: {
          reel1: Math.min(Math.round(reel1Engagement * 10 + reel1.comment_count / 10), 100),
          reel2: Math.min(Math.round(reel2Engagement * 10 + reel2.comment_count / 10), 100),
          winner: reel1.like_count > reel2.like_count ? "reel1" : "reel2",
        },
      },
      insights: [
        `Reel 1 has ${reel1Engagement > reel2Engagement ? "higher" : "lower"} engagement rate`,
        `Reel 2 received ${reel2.comment_count > reel1.comment_count ? "more" : "fewer"} comments`,
        `Overall performance difference: ${Math.abs(reel1Engagement - reel2Engagement).toFixed(1)}%`,
      ],
      recommendations: [
        "Study the winning reel's content style and format",
        "Analyze timing and hashtag strategies of better performing content",
        "Consider A/B testing different content approaches",
        "Focus on elements that drove higher engagement",
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error comparing reels:", error)
    return NextResponse.json({ error: "Failed to compare reels" }, { status: 500 })
  }
}
