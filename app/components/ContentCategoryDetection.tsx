"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2, ListIcon as Category, Tag, TrendingUp, Target, Lightbulb } from "lucide-react"

interface InstagramData {
  caption: string
  image_url: string
  video_url: string
  comments: Array<{
    id: string
    text: string
    username: string
    like_count: number
  }>
}

interface ContentCategoryDetectionProps {
  data: InstagramData
}

interface CategoryAnalysis {
  primaryCategory: {
    name: string
    confidence: number
    description: string
  }
  secondaryCategories: Array<{
    name: string
    confidence: number
    relevance: number
  }>
  contentThemes: Array<{
    theme: string
    strength: number
    keywords: string[]
  }>
  audienceInterests: Array<{
    interest: string
    engagement: number
    comments: number
  }>
  contentStyle: {
    type: "educational" | "entertainment" | "inspirational" | "promotional" | "lifestyle"
    tone: "professional" | "casual" | "humorous" | "serious" | "friendly"
    format: "image" | "video" | "carousel" | "story"
  }
  recommendations: string[]
}

export default function ContentCategoryDetection({ data }: ContentCategoryDetectionProps) {
  const [analysis, setAnalysis] = useState<CategoryAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)

  const analyzeContent = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/analyze-content-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentData: data,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setAnalysis(result)
        setAnalyzed(true)
      }
    } catch (error) {
      console.error("Error analyzing content category:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      lifestyle: "text-pink-600 bg-pink-50",
      beauty: "text-purple-600 bg-purple-50",
      fitness: "text-green-600 bg-green-50",
      food: "text-orange-600 bg-orange-50",
      travel: "text-blue-600 bg-blue-50",
      fashion: "text-indigo-600 bg-indigo-50",
      tech: "text-gray-600 bg-gray-50",
      business: "text-yellow-600 bg-yellow-50",
      education: "text-teal-600 bg-teal-50",
      entertainment: "text-red-600 bg-red-50",
    }
    return colors[category.toLowerCase() as keyof typeof colors] || "text-gray-600 bg-gray-50"
  }

  const getStyleIcon = (type: string) => {
    switch (type) {
      case "educational":
        return <Lightbulb className="w-4 h-4" />
      case "entertainment":
        return <TrendingUp className="w-4 h-4" />
      case "inspirational":
        return <Target className="w-4 h-4" />
      default:
        return <Category className="w-4 h-4" />
    }
  }

  if (!analyzed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Category className="w-5 h-5" />
            Content Category Detection
          </CardTitle>
          <CardDescription>AI-powered analysis to identify your content category and themes</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Button onClick={analyzeContent} disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
            {loading ? "Analyzing..." : "Detect Content Category"}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Analyze caption, image, and comments to determine content category
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Primary Category */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Category className="w-5 h-5" />
            Content Category Analysis
          </CardTitle>
          <CardDescription>AI-detected primary category and content classification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mb-4">
                <Badge className={getCategoryColor(analysis.primaryCategory.name)} variant="outline">
                  <Category className="w-4 h-4 mr-1" />
                  {analysis.primaryCategory.name}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{analysis.primaryCategory.confidence}%</p>
              <p className="text-sm text-gray-500">Confidence</p>
              <Progress value={analysis.primaryCategory.confidence} className="h-2 mt-2" />
            </div>

            <div className="md:col-span-2">
              <h4 className="font-medium mb-2">Category Description</h4>
              <p className="text-sm text-gray-600 mb-4">{analysis.primaryCategory.description}</p>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {getStyleIcon(analysis.contentStyle.type)}
                  </div>
                  <p className="text-sm font-medium capitalize">{analysis.contentStyle.type}</p>
                  <p className="text-xs text-gray-500">Content Type</p>
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{analysis.contentStyle.tone}</p>
                  <p className="text-xs text-gray-500">Tone</p>
                </div>
                <div>
                  <p className="text-sm font-medium capitalize">{analysis.contentStyle.format}</p>
                  <p className="text-xs text-gray-500">Format</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Secondary Categories</CardTitle>
          <CardDescription>Additional content themes detected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.secondaryCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(category.name)} variant="outline">
                    {category.name}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{category.confidence}%</p>
                  <div className="w-16 bg-gray-200 rounded-full h-1 mt-1">
                    <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${category.relevance}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Content Themes
          </CardTitle>
          <CardDescription>Key themes and topics identified</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.contentThemes.map((theme, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium capitalize">{theme.theme}</h4>
                  <span className="text-sm text-gray-500">{theme.strength}%</span>
                </div>
                <Progress value={theme.strength} className="h-2 mb-2" />
                <div className="flex flex-wrap gap-1">
                  {theme.keywords.slice(0, 4).map((keyword, kidx) => (
                    <Badge key={kidx} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audience Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Audience Interests
          </CardTitle>
          <CardDescription>What your audience is interested in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysis.audienceInterests.map((interest, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div>
                  <p className="font-medium capitalize">{interest.interest}</p>
                  <p className="text-xs text-gray-500">{interest.comments} related comments</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{interest.engagement}%</p>
                  <p className="text-xs text-gray-500">Engagement</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Strategy Recommendations */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Content Strategy Recommendations
          </CardTitle>
          <CardDescription>Personalized suggestions based on your content category analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-blue-700">Content Optimization</h4>
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
              <h4 className="font-medium mb-3 text-green-700">Growth Strategies</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Focus on {analysis.primaryCategory.name.toLowerCase()} content to build authority</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Incorporate {analysis.contentThemes[0]?.theme} themes more frequently</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Maintain your {analysis.contentStyle.tone} tone as it resonates with your audience</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Explore {analysis.audienceInterests[0]?.interest} content for higher engagement</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Key Insight</h4>
            <p className="text-sm text-blue-800">
              Your content is primarily categorized as <strong>{analysis.primaryCategory.name}</strong> with
              {analysis.primaryCategory.confidence}% confidence. This suggests you have a clear content focus, which is
              excellent for building a dedicated audience. Consider expanding into related categories like{" "}
              {analysis.secondaryCategories[0]?.name} to diversify your content while maintaining your core theme.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
