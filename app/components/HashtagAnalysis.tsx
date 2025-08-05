"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, Hash, TrendingUp, Target, Zap } from "lucide-react"

interface InstagramData {
  caption: string
  comments: Array<{
    id: string
    text: string
    username: string
    like_count: number
  }>
}

interface HashtagAnalysisProps {
  data: InstagramData
}

interface HashtagData {
  hashtag: string
  frequency: number
  engagement: number
  trend: "rising" | "stable" | "declining"
  category: string
}

interface HashtagAnalysis {
  currentHashtags: HashtagData[]
  trendingHashtags: HashtagData[]
  recommendations: HashtagData[]
  categoryBreakdown: Array<{ category: string; count: number }>
  performanceScore: number
}

export default function HashtagAnalysis({ data }: HashtagAnalysisProps) {
  const [analysis, setAnalysis] = useState<HashtagAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const analyzeHashtags = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caption: data.caption,
          comments: data.comments,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
        setAnalyzed(true)
      }
    } catch (error) {
      console.error("Error analyzing hashtags:", error)
    } finally {
      setLoading(false)
    }
  }

  // Extract hashtags from caption for basic analysis
  const extractHashtags = (text: string) => {
    const hashtagRegex = /#[\w]+/g
    return text.match(hashtagRegex) || []
  }

  const currentHashtags = extractHashtags(data.caption)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case "declining":
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      default:
        return <Target className="w-4 h-4 text-blue-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "rising":
        return "text-green-600 bg-green-50"
      case "declining":
        return "text-red-600 bg-red-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  if (!analyzed) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Current Hashtags
            </CardTitle>
            <CardDescription>Hashtags found in your caption</CardDescription>
          </CardHeader>
          <CardContent>
            {currentHashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentHashtags.map((hashtag, index) => (
                  <Badge key={index} variant="secondary">
                    {hashtag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hashtags found in caption</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Hashtag Analysis</CardTitle>
            <CardDescription>Get trending hashtags and performance insights</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Button onClick={analyzeHashtags} disabled={loading} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Analyze Hashtags"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">Get AI-powered hashtag recommendations</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Performance Overview */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Hashtag Performance Overview
          </CardTitle>
          <CardDescription>Analysis of current hashtags and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.currentHashtags.length}</p>
              <p className="text-sm text-gray-500">Current Hashtags</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.trendingHashtags.length}</p>
              <p className="text-sm text-gray-500">Trending Options</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.recommendations.length}</p>
              <p className="text-sm text-gray-500">Recommendations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.performanceScore}/100</p>
              <p className="text-sm text-gray-500">Performance Score</p>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={analysis.performanceScore} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Current Hashtags Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Current Hashtags</CardTitle>
          <CardDescription>Performance of your hashtags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.currentHashtags.map((hashtag, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  {getTrendIcon(hashtag.trend)}
                  <span className="font-medium">{hashtag.hashtag}</span>
                </div>
                <div className="text-right">
                  <Badge className={getTrendColor(hashtag.trend)} variant="outline">
                    {hashtag.engagement}% engagement
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{hashtag.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Hashtags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Trending Hashtags
          </CardTitle>
          <CardDescription>Popular hashtags in your niche</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.trendingHashtags.slice(0, 8).map((hashtag, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
                    {index + 1}
                  </div>
                  <span className="text-sm font-medium">{hashtag.hashtag}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{hashtag.engagement}%</p>
                  <p className="text-xs text-gray-500">{hashtag.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            Recommendations
          </CardTitle>
          <CardDescription>Suggested hashtags for better reach</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.recommendations.slice(0, 8).map((hashtag, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{hashtag.hashtag}</span>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-blue-600 bg-blue-50">
                    {hashtag.engagement}% potential
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{hashtag.category}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Hashtag Categories</CardTitle>
          <CardDescription>Distribution of hashtag categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analysis.categoryBreakdown.map((category, index) => (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50">
                <p className="text-lg font-bold">{category.count}</p>
                <p className="text-sm text-gray-600 capitalize">{category.category}</p>
                <Progress
                  value={(category.count / analysis.categoryBreakdown.reduce((sum, c) => sum + c.count, 0)) * 100}
                  className="h-2 mt-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hashtag Strategy Insights */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Hashtag Strategy Insights</CardTitle>
          <CardDescription>Recommendations to improve your hashtag performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-green-700">Strengths</h4>
              <ul className="space-y-2 text-sm">
                {analysis.performanceScore > 70 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Strong hashtag performance overall
                  </li>
                )}
                {analysis.currentHashtags.filter((h) => h.trend === "rising").length > 0 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Using {analysis.currentHashtags.filter((h) => h.trend === "rising").length} trending hashtags
                  </li>
                )}
                {analysis.categoryBreakdown.length > 3 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Good category diversity ({analysis.categoryBreakdown.length} categories)
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-orange-700">Recommendations</h4>
              <ul className="space-y-2 text-sm">
                {analysis.currentHashtags.length < 5 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Add more hashtags (currently {analysis.currentHashtags.length}/30)
                  </li>
                )}
                {analysis.currentHashtags.filter((h) => h.trend === "declining").length > 0 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Replace declining hashtags with trending ones
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Mix popular and niche hashtags for better reach
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  Use location-based hashtags if relevant
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
