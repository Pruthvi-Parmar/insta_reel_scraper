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

    const { userData } = await request.json()

    // Return mock data for creator recommendations
    const mockData = {
      similarCreators: [
        {
          username: "content_creator_1",
          full_name: "Creative Content",
          followers: 45000,
          engagement_rate: 8.5,
          similarity_score: 85,
          profile_pic_url: "/placeholder.svg?height=100&width=100&text=CC1",
          bio: "Creating amazing content daily",
          verified: false,
          category: "lifestyle",
          collaboration_potential: "high",
          avg_likes: 2500,
          avg_comments: 150,
        },
        {
          username: "lifestyle_guru",
          full_name: "Lifestyle Guru",
          followers: 62000,
          engagement_rate: 7.2,
          similarity_score: 78,
          profile_pic_url: "/placeholder.svg?height=100&width=100&text=LG",
          bio: "Living life to the fullest",
          verified: true,
          category: "lifestyle",
          collaboration_potential: "medium",
          avg_likes: 3200,
          avg_comments: 180,
        },
      ],
      collaborationOpportunities: [
        {
          username: "collab_creator",
          full_name: "Collaboration Creator",
          followers: 38000,
          engagement_rate: 9.1,
          similarity_score: 72,
          profile_pic_url: "/placeholder.svg?height=100&width=100&text=CC",
          bio: "Open for collaborations",
          verified: false,
          category: "lifestyle",
          collaboration_potential: "high",
          avg_likes: 2800,
          avg_comments: 200,
        },
      ],
      competitorAnalysis: [
        {
          username: "competitor_1",
          full_name: "Top Competitor",
          followers: 85000,
          engagement_rate: 6.8,
          similarity_score: 65,
          profile_pic_url: "/placeholder.svg?height=100&width=100&text=TC",
          bio: "Leading in the space",
          verified: true,
          category: "lifestyle",
          collaboration_potential: "low",
          avg_likes: 4500,
          avg_comments: 250,
        },
      ],
      industryBenchmarks: {
        avgFollowers: 50000,
        avgEngagement: 7.5,
        topPerformers: [
          {
            username: "top_performer",
            full_name: "Top Performer",
            followers: 120000,
            engagement_rate: 12.5,
            similarity_score: 60,
            profile_pic_url: "/placeholder.svg?height=100&width=100&text=TP",
            bio: "Industry leader",
            verified: true,
            category: "lifestyle",
            collaboration_potential: "low",
            avg_likes: 8000,
            avg_comments: 500,
          },
        ],
      },
      recommendations: [
        "Focus on building relationships with similar-sized creators",
        "Engage with creators in your niche regularly",
        "Consider cross-promotion opportunities",
        "Study top performers' content strategies",
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error analyzing creators:", error)
    return NextResponse.json({ error: "Failed to analyze creators" }, { status: 500 })
  }
}
