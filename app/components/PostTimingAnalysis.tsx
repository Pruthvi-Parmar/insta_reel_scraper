"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, Clock, Calendar, TrendingUp, Sun, Moon, Sunrise, Sunset } from "lucide-react"

interface InstagramData {
  taken_at: string
  like_count: number
  comment_count: number
  view_count: number
  username: string
}

interface PostTimingAnalysisProps {
  data: InstagramData
}

interface TimingAnalysis {
  currentPostTime: {
    hour: number
    day: string
    performance: "excellent" | "good" | "average" | "poor"
  }
  bestTimes: Array<{
    hour: number
    day: string
    score: number
    engagement: number
  }>
  dayAnalysis: Array<{
    day: string
    score: number
    posts: number
    avgEngagement: number
  }>
  hourlyAnalysis: Array<{
    hour: number
    score: number
    engagement: number
    period: "morning" | "afternoon" | "evening" | "night"
  }>
  recommendations: string[]
}

export default function PostTimingAnalysis({ data }: PostTimingAnalysisProps) {
  const [analysis, setAnalysis] = useState<TimingAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const analyzePostTiming = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-timing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postData: data,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
        setAnalyzed(true)
      }
    } catch (error) {
      console.error("Error analyzing timing:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPostTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      day: date.toLocaleDateString("en-US", { weekday: "long" }),
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      hour: date.getHours(),
    }
  }

  const getTimeIcon = (hour: number) => {
    if (hour >= 6 && hour < 12) return <Sunrise className="w-4 h-4 text-yellow-500" />
    if (hour >= 12 && hour < 18) return <Sun className="w-4 h-4 text-orange-500" />
    if (hour >= 18 && hour < 22) return <Sunset className="w-4 h-4 text-red-500" />
    return <Moon className="w-4 h-4 text-blue-500" />
  }

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case "excellent":
        return "text-green-600 bg-green-50"
      case "good":
        return "text-blue-600 bg-blue-50"
      case "average":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-red-600 bg-red-50"
    }
  }

  const postTime = formatPostTime(data.taken_at)
  const engagementRate = ((data.like_count + data.comment_count) / Math.max(data.view_count, 1)) * 100

  if (!analyzed) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Post Timing
            </CardTitle>
            <CardDescription>When this post was published</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {getTimeIcon(postTime.hour)}
              <div>
                <p className="text-lg font-semibold">{postTime.time}</p>
                <p className="text-sm text-gray-500">
                  {postTime.day}, {postTime.date}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{engagementRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Engagement Rate</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{postTime.hour}:00</p>
                <p className="text-sm text-gray-500">Hour Posted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Optimal Timing Analysis</CardTitle>
            <CardDescription>Get AI-powered timing recommendations</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Button onClick={analyzePostTiming} disabled={loading} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Analyze Best Times"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">Discover optimal posting times for your audience</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Current Post Performance */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Post Timing Analysis
          </CardTitle>
          <CardDescription>Performance analysis of your current posting time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                {getTimeIcon(analysis.currentPostTime.hour)}
              </div>
              <p className="text-2xl font-bold">{analysis.currentPostTime.hour}:00</p>
              <p className="text-sm text-gray-500">Posted At</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold">{analysis.currentPostTime.day}</p>
              <p className="text-sm text-gray-500">Day of Week</p>
            </div>
            <div className="text-center">
              <Badge className={getPerformanceColor(analysis.currentPostTime.performance)}>
                {analysis.currentPostTime.performance}
              </Badge>
              <p className="text-sm text-gray-500 mt-1">Performance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{engagementRate.toFixed(1)}%</p>
              <p className="text-sm text-gray-500">Engagement</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Times to Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Best Times to Post
          </CardTitle>
          <CardDescription>Optimal posting times for your audience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.bestTimes.slice(0, 6).map((time, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
                    {index + 1}
                  </div>
                  {getTimeIcon(time.hour)}
                  <div>
                    <p className="font-medium">{time.hour}:00</p>
                    <p className="text-xs text-gray-500">{time.day}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{time.score}/100</p>
                  <p className="text-xs text-gray-500">{time.engagement}% engagement</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day of Week Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Day of Week Performance</CardTitle>
          <CardDescription>Best days to post content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.dayAnalysis.map((day, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{day.day}</span>
                  <span>{day.score}/100</span>
                </div>
                <Progress value={day.score} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{day.posts} posts</span>
                  <span>{day.avgEngagement}% avg engagement</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hourly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Hourly Performance</CardTitle>
          <CardDescription>Engagement by time of day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.hourlyAnalysis
              .filter((_, index) => index % 2 === 0)
              .map((hour, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTimeIcon(hour.hour)}
                    <span className="text-sm font-medium">{hour.hour}:00</span>
                    <Badge variant="outline" className="text-xs">
                      {hour.period}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${hour.score}%` }}></div>
                    </div>
                    <span className="text-xs text-gray-500 w-8">{hour.score}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Timing Recommendations */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Timing Recommendations</CardTitle>
          <CardDescription>Personalized suggestions to optimize your posting schedule</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-blue-700">Key Insights</h4>
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
              <h4 className="font-medium mb-3 text-green-700">Action Items</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>
                    Post at {analysis.bestTimes[0]?.hour}:00 on {analysis.bestTimes[0]?.day}s for best results
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Avoid posting during low-engagement hours (late night/early morning)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Schedule posts 1-2 hours before peak audience activity</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Test different time slots and track performance changes</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
