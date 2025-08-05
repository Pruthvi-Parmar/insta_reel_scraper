"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Smile, Frown, Meh, MessageSquare, TrendingUp } from "lucide-react"

interface Comment {
  id: string
  text: string
  username: string
  like_count: number
}

interface InstagramData {
  comments: Comment[]
  caption: string
}

interface SentimentAnalysisProps {
  data: InstagramData
}

interface SentimentResult {
  positive: number
  negative: number
  neutral: number
  overall: "positive" | "negative" | "neutral"
  score: number
  topPositiveComments: Comment[]
  topNegativeComments: Comment[]
  emotions: {
    joy: number
    anger: number
    sadness: number
    fear: number
    surprise: number
  }
}

export default function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  const [sentiment, setSentiment] = useState<SentimentResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const analyzeSentiment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comments: data.comments,
          caption: data.caption,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSentiment(result)
        setAnalyzed(true)
      }
    } catch (error) {
      console.error("Error analyzing sentiment:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (type: string) => {
    switch (type) {
      case "positive":
        return "text-green-600 bg-green-50"
      case "negative":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getSentimentIcon = (type: string) => {
    switch (type) {
      case "positive":
        return <Smile className="w-4 h-4" />
      case "negative":
        return <Frown className="w-4 h-4" />
      default:
        return <Meh className="w-4 h-4" />
    }
  }

  if (!analyzed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Sentiment Analysis
          </CardTitle>
          <CardDescription>Analyze the emotional tone of comments and overall sentiment</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Button onClick={analyzeSentiment} disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            {loading ? "Analyzing..." : "Analyze Sentiment"}
          </Button>
          <p className="text-sm text-gray-500 mt-2">Click to analyze {data.comments.length} comments using AI</p>
        </CardContent>
      </Card>
    )
  }

  if (!sentiment) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overall Sentiment */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Overall Sentiment Analysis
          </CardTitle>
          <CardDescription>AI-powered analysis of {data.comments.length} comments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getSentimentIcon(sentiment.overall)}
              <div>
                <p className="text-2xl font-bold capitalize">{sentiment.overall}</p>
                <Badge className={getSentimentColor(sentiment.overall)}>Score: {sentiment.score.toFixed(2)}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-2">
                <Smile className="w-4 h-4" />
                <span className="font-medium">Positive</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{sentiment.positive}%</p>
              <Progress value={sentiment.positive} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-gray-600 mb-2">
                <Meh className="w-4 h-4" />
                <span className="font-medium">Neutral</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">{sentiment.neutral}%</p>
              <Progress value={sentiment.neutral} className="h-2 mt-2" />
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-2">
                <Frown className="w-4 h-4" />
                <span className="font-medium">Negative</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{sentiment.negative}%</p>
              <Progress value={sentiment.negative} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emotion Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Emotion Analysis</CardTitle>
          <CardDescription>Detailed emotional breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(sentiment.emotions).map(([emotion, percentage]) => (
              <div key={emotion}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="capitalize">{emotion}</span>
                  <span>{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Positive Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile className="w-5 h-5 text-green-500" />
            Most Positive Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sentiment.topPositiveComments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">@{comment.username}</p>
                <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                {comment.like_count > 0 && <p className="text-xs text-gray-500 mt-1">{comment.like_count} likes</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Negative Comments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Frown className="w-5 h-5 text-red-500" />
            Critical Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sentiment.topNegativeComments.slice(0, 3).map((comment) => (
              <div key={comment.id} className="p-3 bg-red-50 rounded-lg">
                <p className="text-sm font-medium">@{comment.username}</p>
                <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                {comment.like_count > 0 && <p className="text-xs text-gray-500 mt-1">{comment.like_count} likes</p>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sentiment Insights */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Sentiment Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Key Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>
                    {sentiment.positive > 60
                      ? "Highly positive audience response - great content resonance"
                      : sentiment.positive > 40
                        ? "Generally positive reception with room for improvement"
                        : "Mixed reactions - consider adjusting content strategy"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>
                    {sentiment.emotions.joy > 30
                      ? "Content successfully evokes joy and happiness"
                      : "Consider adding more uplifting or entertaining elements"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>
                    {sentiment.negative < 20
                      ? "Low negative sentiment indicates good content quality"
                      : "Address concerns raised in negative comments"}
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">Recommendations</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>
                    {sentiment.positive > 50
                      ? "Replicate successful elements in future content"
                      : "Focus on creating more engaging, positive content"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Engage with positive commenters to build community</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>
                    {sentiment.negative > 20
                      ? "Address negative feedback constructively"
                      : "Maintain current content quality standards"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
