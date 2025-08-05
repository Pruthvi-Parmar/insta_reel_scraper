"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Loader2, Users, TrendingUp, Heart, Star } from "lucide-react"

interface InstagramData {
  username: string
  followers: number
  bio: string
  caption: string
  like_count: number
  comment_count: number
  view_count: number
}

interface CreatorRecommendationsProps {
  data: InstagramData
}

interface Creator {
  username: string
  full_name: string
  followers: number
  engagement_rate: number
  similarity_score: number
  profile_pic_url: string
  bio: string
  verified: boolean
  category: string
  collaboration_potential: "high" | "medium" | "low"
  avg_likes: number
  avg_comments: number
}

interface CreatorAnalysis {
  similarCreators: Creator[]
  collaborationOpportunities: Creator[]
  competitorAnalysis: Creator[]
  industryBenchmarks: {
    avgFollowers: number
    avgEngagement: number
    topPerformers: Creator[]
  }
  recommendations: string[]
}

export default function CreatorRecommendations({ data }: CreatorRecommendationsProps) {
  const [analysis, setAnalysis] = useState<CreatorAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const analyzeCreators = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData: data,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
        setAnalyzed(true)
      }
    } catch (error) {
      console.error("Error analyzing creators:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const getCollaborationColor = (potential: string) => {
    switch (potential) {
      case "high":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const currentEngagement = ((data.like_count + data.comment_count) / Math.max(data.view_count, 1)) * 100

  if (!analyzed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Creator Recommendations
          </CardTitle>
          <CardDescription>Discover similar creators and collaboration opportunities</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Button onClick={analyzeCreators} disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            {loading ? "Analyzing..." : "Find Similar Creators"}
          </Button>
          <p className="text-sm text-gray-500 mt-2">Get AI-powered creator recommendations based on your content</p>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Industry Benchmarks */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Industry Benchmarks
          </CardTitle>
          <CardDescription>How you compare to similar creators in your niche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{formatNumber(data.followers)}</p>
              <p className="text-sm text-gray-500">Your Followers</p>
              <div className="mt-2">
                <Progress
                  value={Math.min((data.followers / analysis.industryBenchmarks.avgFollowers) * 100, 100)}
                  className="h-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  vs {formatNumber(analysis.industryBenchmarks.avgFollowers)} avg
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{currentEngagement.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Your Engagement</p>
              <div className="mt-2">
                <Progress
                  value={Math.min((currentEngagement / analysis.industryBenchmarks.avgEngagement) * 100, 100)}
                  className="h-2"
                />
                <p className="text-xs text-gray-400 mt-1">
                  vs {analysis.industryBenchmarks.avgEngagement.toFixed(1)}% avg
                </p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatNumber(data.like_count)}</p>
              <p className="text-sm text-gray-500">Post Likes</p>
              <div className="mt-2">
                <Progress value={75} className="h-2" />
                <p className="text-xs text-gray-400 mt-1">Above average</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{formatNumber(data.comment_count)}</p>
              <p className="text-sm text-gray-500">Post Comments</p>
              <div className="mt-2">
                <Progress value={60} className="h-2" />
                <p className="text-xs text-gray-400 mt-1">Good engagement</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Similar Creators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Similar Creators
          </CardTitle>
          <CardDescription>Creators with similar content and audience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.similarCreators.slice(0, 5).map((creator, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={creator.profile_pic_url || "/placeholder.svg"} alt={creator.username} />
                  <AvatarFallback>{creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">@{creator.username}</p>
                    {creator.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{creator.full_name}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{formatNumber(creator.followers)} followers</span>
                    <span>{creator.engagement_rate.toFixed(1)}% engagement</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs">
                    {creator.similarity_score}% match
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Collaboration Opportunities
          </CardTitle>
          <CardDescription>Creators perfect for partnerships</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.collaborationOpportunities.slice(0, 5).map((creator, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-yellow-50">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={creator.profile_pic_url || "/placeholder.svg"} alt={creator.username} />
                  <AvatarFallback>{creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">@{creator.username}</p>
                    <Badge className={getCollaborationColor(creator.collaboration_potential)}>
                      {creator.collaboration_potential}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{creator.category}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{formatNumber(creator.followers)} followers</span>
                    <span>{formatNumber(creator.avg_likes)} avg likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Top Performers
          </CardTitle>
          <CardDescription>Leading creators in your category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.industryBenchmarks.topPerformers.slice(0, 5).map((creator, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-sm font-medium text-green-700">
                  {index + 1}
                </div>
                <Avatar className="w-12 h-12">
                  <AvatarImage src={creator.profile_pic_url || "/placeholder.svg"} alt={creator.username} />
                  <AvatarFallback>{creator.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">@{creator.username}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {formatNumber(creator.followers)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {creator.engagement_rate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Competitor Analysis</CardTitle>
          <CardDescription>Direct competitors and their performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Creator</th>
                  <th className="text-left p-2">Followers</th>
                  <th className="text-left p-2">Engagement</th>
                  <th className="text-left p-2">Avg Likes</th>
                  <th className="text-left p-2">Avg Comments</th>
                  <th className="text-left p-2">Category</th>
                </tr>
              </thead>
              <tbody>
                {analysis.competitorAnalysis.slice(0, 8).map((creator, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={creator.profile_pic_url || "/placeholder.svg"} alt={creator.username} />
                          <AvatarFallback className="text-xs">
                            {creator.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">@{creator.username}</p>
                          {creator.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-2">{formatNumber(creator.followers)}</td>
                    <td className="p-2">{creator.engagement_rate.toFixed(1)}%</td>
                    <td className="p-2">{formatNumber(creator.avg_likes)}</td>
                    <td className="p-2">{formatNumber(creator.avg_comments)}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="text-xs">
                        {creator.category}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Growth Recommendations</CardTitle>
          <CardDescription>Actionable insights based on creator analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-blue-700">Collaboration Strategy</h4>
              <ul className="space-y-2 text-sm">
                {analysis.recommendations.slice(0, 4).map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-green-700">Growth Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>
                    Partner with creators who have {analysis.collaborationOpportunities[0]?.collaboration_potential}{" "}
                    collaboration potential
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Study top performers' content strategies and posting patterns</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Engage with similar creators to build community relationships</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Consider cross-promotion opportunities with complementary creators</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
