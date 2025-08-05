"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, TrendingUp, Zap, Target, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

interface InstagramData {
  like_count: number
  comment_count: number
  view_count: number
  followers: number
  caption: string
  taken_at: string
  comments: Array<{
    id: string
    text: string
    username: string
    like_count: number
  }>
}

interface ViralityPredictionProps {
  data: InstagramData
}

interface ViralityAnalysis {
  viralityScore: number
  viralityLevel: "low" | "medium" | "high" | "viral"
  factors: Array<{
    factor: string
    impact: number
    status: "positive" | "negative" | "neutral"
    description: string
  }>
  predictions: {
    reach: number
    engagement: number
    shareability: number
    longevity: number
  }
  recommendations: string[]
  riskFactors: string[]
}

export default function ViralityPrediction({ data }: ViralityPredictionProps) {
  const [analysis, setAnalysis] = useState<ViralityAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const analyzeVirality = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-virality", {
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
      console.error("Error analyzing virality:", error)
    } finally {
      setLoading(false)
    }
  }

  const getViralityColor = (level: string) => {
    switch (level) {
      case "viral":
        return "text-purple-600 bg-purple-50"
      case "high":
        return "text-green-600 bg-green-50"
      case "medium":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getFactorIcon = (status: string) => {
    switch (status) {
      case "positive":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "negative":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const currentEngagement = ((data.like_count + data.comment_count) / Math.max(data.view_count, 1)) * 100
  const reachRate = (data.view_count / data.followers) * 100

  if (!analyzed) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Current Performance
            </CardTitle>
            <CardDescription>Basic metrics of your current post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{currentEngagement.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Engagement Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{reachRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-500">Reach Rate</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Likes</span>
                <span>{data.like_count.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Comments</span>
                <span>{data.comment_count.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Views</span>
                <span>{data.view_count.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Virality Prediction</CardTitle>
            <CardDescription>AI-powered analysis of viral potential</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Button onClick={analyzeVirality} disabled={loading} className="flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Analyzing..." : "Predict Virality"}
            </Button>
            <p className="text-sm text-gray-500 mt-2">Get AI predictions on viral potential and reach</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Virality Score */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Virality Prediction Score
          </CardTitle>
          <CardDescription>AI-powered analysis of your content's viral potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="mb-2">
                <Badge className={getViralityColor(analysis.viralityLevel)} variant="outline">
                  {analysis.viralityLevel.toUpperCase()}
                </Badge>
              </div>
              <p className="text-3xl font-bold">{analysis.viralityScore}/100</p>
              <p className="text-sm text-gray-500">Virality Score</p>
              <Progress value={analysis.viralityScore} className="h-3 mt-2" />
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.predictions.reach}%</p>
              <p className="text-sm text-gray-500">Predicted Reach</p>
              <Progress value={analysis.predictions.reach} className="h-2 mt-2" />
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.predictions.engagement}%</p>
              <p className="text-sm text-gray-500">Engagement Potential</p>
              <Progress value={analysis.predictions.engagement} className="h-2 mt-2" />
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold">{analysis.predictions.shareability}%</p>
              <p className="text-sm text-gray-500">Shareability</p>
              <Progress value={analysis.predictions.shareability} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Viral Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Viral Factors
          </CardTitle>
          <CardDescription>Elements contributing to viral potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.factors.map((factor, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className="mt-0.5">{getFactorIcon(factor.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{factor.factor}</p>
                    <span className="text-sm font-medium">
                      {factor.impact > 0 ? "+" : ""}
                      {factor.impact}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{factor.description}</p>
                  <div className="mt-2">
                    <Progress
                      value={Math.abs(factor.impact)}
                      className={`h-1 ${factor.impact > 0 ? "text-green-500" : "text-red-500"}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictions Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Predictions</CardTitle>
          <CardDescription>Breakdown of viral potential metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Reach Potential</span>
                <span>{analysis.predictions.reach}%</span>
              </div>
              <Progress value={analysis.predictions.reach} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Expected audience reach beyond followers</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Engagement Growth</span>
                <span>{analysis.predictions.engagement}%</span>
              </div>
              <Progress value={analysis.predictions.engagement} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Predicted increase in likes and comments</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Share Likelihood</span>
                <span>{analysis.predictions.shareability}%</span>
              </div>
              <Progress value={analysis.predictions.shareability} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Probability of being shared/reposted</p>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Content Longevity</span>
                <span>{analysis.predictions.longevity}%</span>
              </div>
              <Progress value={analysis.predictions.longevity} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">How long engagement will continue</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Risk Factors
          </CardTitle>
          <CardDescription>Potential barriers to viral success</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.riskFactors.length > 0 ? (
              analysis.riskFactors.map((risk, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-red-50">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{risk}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-green-600">No significant risk factors detected!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Virality Optimization Recommendations</CardTitle>
          <CardDescription>Actionable steps to increase your content's viral potential</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-green-700">Boost Viral Potential</h4>
              <ul className="space-y-2 text-sm">
                {analysis.recommendations.slice(0, 4).map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-blue-700">Strategic Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>
                    Your content has {analysis.viralityLevel} viral potential with a score of {analysis.viralityScore}
                    /100
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>
                    Focus on improving{" "}
                    {analysis.factors.filter((f) => f.status === "negative")[0]?.factor || "engagement timing"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>
                    Your strongest factor is{" "}
                    {analysis.factors.filter((f) => f.status === "positive")[0]?.factor || "content quality"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Expected reach: {analysis.predictions.reach}% beyond current followers</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Virality Forecast</h4>
            <p className="text-sm text-purple-800">
              Based on our AI analysis, your content has <strong>{analysis.viralityLevel}</strong> viral potential. The
              key factors driving this prediction are your{" "}
              {analysis.factors.filter((f) => f.status === "positive").length} positive viral indicators. To maximize
              viral success, focus on the recommendations above and monitor engagement patterns in the first 2-4 hours
              after posting, as this is the critical window for viral content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
