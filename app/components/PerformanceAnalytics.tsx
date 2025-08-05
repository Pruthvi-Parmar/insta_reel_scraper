"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Users, Heart, MessageCircle, BarChart3 } from "lucide-react"

interface InstagramData {
  username: string
  followers: number
  like_count: number
  view_count: number
  comment_count: number
  caption: string
  comments: Array<{
    id: string
    text: string
    username: string
    like_count: number
  }>
}

interface PerformanceAnalyticsProps {
  data: InstagramData
}

export default function PerformanceAnalytics({ data }: PerformanceAnalyticsProps) {
  const [metrics, setMetrics] = useState({
    engagementRate: 0,
    likeToViewRatio: 0,
    commentToLikeRatio: 0,
    averageCommentLength: 0,
    performanceScore: 0,
  })

  useEffect(() => {
    // Calculate engagement rate (likes + comments) / followers * 100
    const engagementRate = ((data.like_count + data.comment_count) / data.followers) * 100

    // Calculate like to view ratio
    const likeToViewRatio = data.view_count > 0 ? (data.like_count / data.view_count) * 100 : 0

    // Calculate comment to like ratio
    const commentToLikeRatio = data.like_count > 0 ? (data.comment_count / data.like_count) * 100 : 0

    // Calculate average comment length
    const averageCommentLength =
      data.comments.length > 0
        ? data.comments.reduce((sum, comment) => sum + comment.text.length, 0) / data.comments.length
        : 0

    // Calculate overall performance score (0-100)
    const performanceScore = Math.min(
      100,
      engagementRate * 0.4 +
        likeToViewRatio * 0.3 +
        commentToLikeRatio * 0.2 +
        Math.min(averageCommentLength / 50, 1) * 10,
    )

    setMetrics({
      engagementRate: Math.round(engagementRate * 100) / 100,
      likeToViewRatio: Math.round(likeToViewRatio * 100) / 100,
      commentToLikeRatio: Math.round(commentToLikeRatio * 100) / 100,
      averageCommentLength: Math.round(averageCommentLength),
      performanceScore: Math.round(performanceScore),
    })
  }, [data])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return num.toString()
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 80) return { level: "Excellent", color: "bg-green-500", textColor: "text-green-700" }
    if (score >= 60) return { level: "Good", color: "bg-blue-500", textColor: "text-blue-700" }
    if (score >= 40) return { level: "Average", color: "bg-yellow-500", textColor: "text-yellow-700" }
    return { level: "Needs Improvement", color: "bg-red-500", textColor: "text-red-700" }
  }

  const performance = getPerformanceLevel(metrics.performanceScore)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overall Performance Score */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Overall Performance Score
          </CardTitle>
          <CardDescription>Comprehensive analysis of your post's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-3xl font-bold">{metrics.performanceScore}/100</p>
              <Badge className={performance.textColor} variant="outline">
                {performance.level}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Performance Level</p>
              <div className="flex items-center gap-2">
                {metrics.performanceScore >= 70 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>
          </div>
          <Progress value={metrics.performanceScore} className="h-3" />
        </CardContent>
      </Card>

      {/* Engagement Rate */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-500" />
            Engagement Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{metrics.engagementRate}%</p>
            <p className="text-sm text-gray-500">(Likes + Comments) / Followers</p>
            <Progress value={Math.min(metrics.engagementRate * 10, 100)} className="h-2" />
            <div className="text-xs text-gray-400">Industry average: 1-3%</div>
          </div>
        </CardContent>
      </Card>

      {/* Like to View Ratio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Like Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{metrics.likeToViewRatio}%</p>
            <p className="text-sm text-gray-500">Likes per view</p>
            <Progress value={Math.min(metrics.likeToViewRatio * 2, 100)} className="h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{formatNumber(data.like_count)} likes</span>
              <span className="text-gray-400">{formatNumber(data.view_count)} views</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Comment Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{metrics.commentToLikeRatio}%</p>
            <p className="text-sm text-gray-500">Comments per like</p>
            <Progress value={Math.min(metrics.commentToLikeRatio * 5, 100)} className="h-2" />
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{formatNumber(data.comment_count)} comments</span>
              <span className="text-gray-400">{formatNumber(data.like_count)} likes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Reach */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            Audience Reach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Follower Reach</span>
                <span>{((data.view_count / data.followers) * 100).toFixed(1)}%</span>
              </div>
              <Progress value={Math.min((data.view_count / data.followers) * 100, 100)} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold">{formatNumber(data.followers)}</p>
                <p className="text-xs text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-lg font-semibold">{formatNumber(data.view_count)}</p>
                <p className="text-xs text-gray-500">Views</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comment Quality */}
      <Card>
        <CardHeader>
          <CardTitle>Comment Quality</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-2xl font-bold">{metrics.averageCommentLength}</p>
              <p className="text-sm text-gray-500">Average comment length</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quality Score</span>
                <span>{Math.min((metrics.averageCommentLength / 50) * 100, 100).toFixed(0)}%</span>
              </div>
              <Progress value={Math.min((metrics.averageCommentLength / 50) * 100, 100)} className="h-2" />
              <p className="text-xs text-gray-400">Longer comments indicate higher engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>Key takeaways and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">Strengths</h4>
              <ul className="text-sm space-y-1">
                {metrics.engagementRate > 3 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    High engagement rate ({metrics.engagementRate}%)
                  </li>
                )}
                {metrics.commentToLikeRatio > 15 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Strong comment engagement
                  </li>
                )}
                {metrics.averageCommentLength > 30 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Quality comments from audience
                  </li>
                )}
                {data.view_count > data.followers && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Reached beyond follower base
                  </li>
                )}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-orange-700">Areas for Improvement</h4>
              <ul className="text-sm space-y-1">
                {metrics.engagementRate < 1 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Low engagement rate - try more interactive content
                  </li>
                )}
                {metrics.likeToViewRatio < 5 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Low like rate - improve content quality
                  </li>
                )}
                {metrics.commentToLikeRatio < 5 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Low comment rate - ask questions to encourage discussion
                  </li>
                )}
                {data.view_count < data.followers * 0.3 && (
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Limited reach - optimize posting time
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
