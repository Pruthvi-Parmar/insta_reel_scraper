"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, GitCompare, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface ComparisonData {
  reel1: any
  reel2: any
  comparison: {
    engagement: {
      reel1: number
      reel2: number
      winner: "reel1" | "reel2" | "tie"
    }
    reach: {
      reel1: number
      reel2: number
      winner: "reel1" | "reel2" | "tie"
    }
    sentiment: {
      reel1: number
      reel2: number
      winner: "reel1" | "reel2" | "tie"
    }
    virality: {
      reel1: number
      reel2: number
      winner: "reel1" | "reel2" | "tie"
    }
  }
  insights: string[]
  recommendations: string[]
}

export default function CompareReels() {
  const [reel1Data, setReel1Data] = useState("")
  const [reel2Data, setReel2Data] = useState("")
  const [comparison, setComparison] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(false)

  const compareReels = async () => {
    if (!reel1Data.trim() || !reel2Data.trim()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/compare-reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reel1: JSON.parse(reel1Data),
          reel2: JSON.parse(reel2Data),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setComparison(result)
      }
    } catch (error) {
      console.error("Error comparing reels:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWinnerIcon = (winner: string, current: string) => {
    if (winner === current) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (winner === "tie") return <Minus className="w-4 h-4 text-gray-500" />
    return <TrendingDown className="w-4 h-4 text-red-500" />
  }

  const getWinnerColor = (winner: string, current: string) => {
    if (winner === current) return "text-green-600 bg-green-50"
    if (winner === "tie") return "text-gray-600 bg-gray-50"
    return "text-red-600 bg-red-50"
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reel 1 Data</CardTitle>
            <CardDescription>Paste the JSON data for the first reel</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste Reel 1 JSON data here..."
              value={reel1Data}
              onChange={(e) => setReel1Data(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reel 2 Data</CardTitle>
            <CardDescription>Paste the JSON data for the second reel</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste Reel 2 JSON data here..."
              value={reel2Data}
              onChange={(e) => setReel2Data(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      {/* Compare Button */}
      <div className="text-center">
        <Button
          onClick={compareReels}
          disabled={loading || !reel1Data.trim() || !reel2Data.trim()}
          className="flex items-center gap-2"
          size="lg"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitCompare className="w-4 h-4" />}
          {loading ? "Comparing..." : "Compare Reels"}
        </Button>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Engagement Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className={getWinnerColor(comparison.comparison.engagement.winner, "reel1")}>
                  Reel 1: {comparison.comparison.engagement.reel1.toFixed(1)}%
                </Badge>
                <div className="flex justify-center mt-1">
                  {getWinnerIcon(comparison.comparison.engagement.winner, "reel1")}
                </div>
              </div>

              <div className="text-center">
                <Badge className={getWinnerColor(comparison.comparison.engagement.winner, "reel2")}>
                  Reel 2: {comparison.comparison.engagement.reel2.toFixed(1)}%
                </Badge>
                <div className="flex justify-center mt-1">
                  {getWinnerIcon(comparison.comparison.engagement.winner, "reel2")}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Difference:{" "}
                  {Math.abs(comparison.comparison.engagement.reel1 - comparison.comparison.engagement.reel2).toFixed(1)}
                  %
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Reach Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Reach Rate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className={getWinnerColor(comparison.comparison.reach.winner, "reel1")}>
                  Reel 1: {comparison.comparison.reach.reel1.toFixed(1)}%
                </Badge>
                <div className="flex justify-center mt-1">
                  {getWinnerIcon(comparison.comparison.reach.winner, "reel1")}
                </div>
              </div>

              <div className="text-center">
                <Badge className={getWinnerColor(comparison.comparison.reach.winner, "reel2")}>
                  Reel 2: {comparison.comparison.reach.reel2.toFixed(1)}%
                </Badge>
                <div className="flex justify-center mt-1">
                  {getWinnerIcon(comparison.comparison.reach.winner, "reel2")}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Difference:{" "}
                  {Math.abs(comparison.comparison.reach.reel1 - comparison.comparison.reach.reel2).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sentiment Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className={getWinnerColor(comparison.comparison.sentiment.winner, "reel1")}>
                  Reel 1: {comparison.comparison.sentiment.reel1.toFixed(1)}
                </Badge>
                <div className="flex justify-center mt-1">
                  {getWinnerIcon(comparison.comparison.sentiment.winner, "reel1")}
                </div>
              </div>

              <div className="text-center">
                <Badge className={getWinnerColor(comparison.comparison.sentiment.winner, "reel2")}>
                  Reel 2: {comparison.comparison.sentiment.reel2.toFixed(1)}
                </Badge>
                <div className="flex justify-center mt-1">
                  {getWinnerIcon(comparison.comparison.sentiment.winner, "reel2")}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Difference:{" "}
                  {Math.abs(comparison.comparison.sentiment.reel1 - comparison.comparison.sentiment.reel2).toFixed(1)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Virality Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Virality Score</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className={getWinnerColor(comparison.comparison.virality.winner, "reel1")}>
                  Reel 1: {comparison.comparison.virality.reel1}/100
                </Badge>
                <div className="flex justify-center mt-1">
                  {getWinnerIcon(comparison.comparison.virality.winner, "reel1")}
                </div>
              </div>

              <div className="text-center">
                <Badge className={getWinnerColor(comparison.comparison.virality.winner, "reel2")}>
                  Reel 2: {comparison.comparison.virality.reel2}/100
                </Badge>
                <div className="flex justify-center mt-1">
                  {getWinnerIcon(comparison.comparison.virality.winner, "reel2")}
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Difference: {Math.abs(comparison.comparison.virality.reel1 - comparison.comparison.virality.reel2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>What the data tells us about these reels</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {comparison.insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>How to improve future content based on this comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {comparison.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
