"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { MessageSquare, Heart, TrendingUp, Users, Star } from "lucide-react"

interface Comment {
  id: string
  text: string
  username: string
  like_count: number
}

interface InstagramData {
  comments: Comment[]
  taken_at: string
}

interface CommentAnalysisProps {
  data: InstagramData
}

interface CommentStats {
  totalComments: number
  averageLength: number
  totalLikes: number
  topCommenters: Array<{ username: string; count: number }>
  engagementDistribution: Array<{ range: string; count: number }>
  timeDistribution: Array<{ hour: number; count: number }>
  wordCloud: Array<{ word: string; frequency: number }>
}

export default function CommentAnalysis({ data }: CommentAnalysisProps) {
  const [stats, setStats] = useState<CommentStats | null>(null)

  useEffect(() => {
    if (data.comments.length === 0) return

    // Calculate comment statistics
    const totalComments = data.comments.length
    const averageLength = data.comments.reduce((sum, comment) => sum + comment.text.length, 0) / totalComments
    const totalLikes = data.comments.reduce((sum, comment) => sum + comment.like_count, 0)

    // Top commenters
    const commenterCounts = data.comments.reduce(
      (acc, comment) => {
        acc[comment.username] = (acc[comment.username] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topCommenters = Object.entries(commenterCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([username, count]) => ({ username, count }))

    // Engagement distribution
    const engagementRanges = [
      { range: "0 likes", min: 0, max: 0 },
      { range: "1-5 likes", min: 1, max: 5 },
      { range: "6-10 likes", min: 6, max: 10 },
      { range: "11+ likes", min: 11, max: Number.POSITIVE_INFINITY },
    ]

    const engagementDistribution = engagementRanges.map((range) => ({
      range: range.range,
      count: data.comments.filter((comment) => comment.like_count >= range.min && comment.like_count <= range.max)
        .length,
    }))

    // Simple word frequency analysis
    const words = data.comments
      .flatMap((comment) => comment.text.toLowerCase().split(/\s+/))
      .filter(
        (word) =>
          word.length > 3 &&
          ![
            "this",
            "that",
            "with",
            "have",
            "will",
            "from",
            "they",
            "been",
            "were",
            "said",
            "each",
            "which",
            "their",
            "time",
            "more",
            "very",
            "what",
            "know",
            "just",
            "first",
            "into",
            "over",
            "think",
            "also",
            "your",
            "work",
            "life",
            "only",
            "can",
            "still",
            "should",
            "after",
            "being",
            "now",
            "made",
            "before",
            "here",
            "through",
            "when",
            "where",
            "how",
            "all",
            "any",
            "may",
            "say",
            "she",
            "use",
            "her",
            "him",
            "his",
            "has",
            "had",
          ].includes(word),
      )

    const wordFreq = words.reduce(
      (acc, word) => {
        acc[word] = (acc[word] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const wordCloud = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, frequency]) => ({ word, frequency }))

    // Mock time distribution (since we don't have individual comment timestamps)
    const timeDistribution = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor((Math.random() * totalComments) / 10),
    }))

    setStats({
      totalComments,
      averageLength: Math.round(averageLength),
      totalLikes,
      topCommenters,
      engagementDistribution,
      timeDistribution,
      wordCloud,
    })
  }, [data.comments])

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Comment Analysis</CardTitle>
          <CardDescription>Loading comment statistics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overview Stats */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Comment Overview
          </CardTitle>
          <CardDescription>Comprehensive analysis of {stats.totalComments} comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-500 mb-2">
                <MessageSquare className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{stats.totalComments}</p>
              <p className="text-sm text-gray-500">Total Comments</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-500 mb-2">
                <Heart className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{stats.totalLikes}</p>
              <p className="text-sm text-gray-500">Comment Likes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-500 mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{stats.averageLength}</p>
              <p className="text-sm text-gray-500">Avg Length</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-500 mb-2">
                <Star className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">
                {stats.totalComments > 0 ? (stats.totalLikes / stats.totalComments).toFixed(1) : "0"}
              </p>
              <p className="text-sm text-gray-500">Likes per Comment</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Commenters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Commenters
          </CardTitle>
          <CardDescription>Most active users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.topCommenters.map((commenter, index) => (
              <div key={commenter.username} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-medium">
                  {index + 1}
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{commenter.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">@{commenter.username}</p>
                  <p className="text-xs text-gray-500">{commenter.count} comments</p>
                </div>
                <Badge variant="secondary">{commenter.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Comment Engagement</CardTitle>
          <CardDescription>Distribution of comment likes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.engagementDistribution.map((range) => (
              <div key={range.range}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{range.range}</span>
                  <span>{range.count} comments</span>
                </div>
                <Progress value={(range.count / stats.totalComments) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Words */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Words</CardTitle>
          <CardDescription>Most frequently used words</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.wordCloud.map((word, index) => (
              <div key={word.word} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{word.word}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(word.frequency / stats.wordCloud[0].frequency) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-6">{word.frequency}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comment Quality Analysis */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Comment Quality Insights</CardTitle>
          <CardDescription>Analysis of comment engagement and quality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-green-700">High Quality Indicators</h4>
              <ul className="space-y-2 text-sm">
                {stats.averageLength > 50 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Long, thoughtful comments ({stats.averageLength} chars avg)
                  </li>
                )}
                {stats.totalLikes / stats.totalComments > 1 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    High comment engagement ({(stats.totalLikes / stats.totalComments).toFixed(1)} likes/comment)
                  </li>
                )}
                {stats.topCommenters.length > 0 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Active community with repeat commenters
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-blue-700">Engagement Patterns</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {(
                    ((stats.engagementDistribution.find((r) => r.range === "0 likes")?.count || 0) /
                      stats.totalComments) *
                    100
                  ).toFixed(0)}
                  % comments have no likes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {(
                    ((stats.engagementDistribution.find((r) => r.range === "11+ likes")?.count || 0) /
                      stats.totalComments) *
                    100
                  ).toFixed(0)}
                  % highly liked comments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Top commenter: @{stats.topCommenters[0]?.username} ({stats.topCommenters[0]?.count} comments)
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-purple-700">Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  {stats.totalLikes / stats.totalComments < 0.5
                    ? "Encourage more comment engagement"
                    : "Maintain current engagement levels"}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Engage with top commenters to build community
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  {stats.averageLength < 30
                    ? "Ask questions to encourage longer responses"
                    : "Continue creating discussion-worthy content"}
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
