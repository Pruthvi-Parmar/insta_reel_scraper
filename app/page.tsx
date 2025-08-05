"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Loader2,
  Upload,
  BarChart3,
  MessageSquare,
  Hash,
  Clock,
  Users,
  ListIcon as Category,
  TrendingUp,
  Download,
  GitCompare,
} from "lucide-react"
import StaticDataDisplay from "./components/StaticDataDisplay"
import PerformanceAnalytics from "./components/PerformanceAnalytics"
import SentimentAnalysis from "./components/SentimentAnalysis"
import CommentAnalysis from "./components/CommentAnalysis"
import HashtagAnalysis from "./components/HashtagAnalysis"
import PostTimingAnalysis from "./components/PostTimingAnalysis"
import CreatorRecommendations from "./components/CreatorRecommendations"
import ContentCategoryDetection from "./components/ContentCategoryDetection"
import ViralityPrediction from "./components/ViralityPrediction"
import CompareReels from "./components/CompareReels"
import ApiKeySetup from "./components/ApiKeySetup"
import { log } from "console"

interface InstagramData {
  method: string
  shortcode: string
  id: number
  username: string
  full_name: string
  bio: string
  verified: boolean
  profile_pic_url: string
  followers: number
  like_count: number
  view_count: number
  comment_count: number
  caption: string
  taken_at: string
  video_url: string
  image_url: string
  comments: Array<{
    id: string
    text: string
    username: string
    like_count: number
  }>
}

export default function InstagramAnalytics() {

  const [jsonInput, setJsonInput] = useState("");
  const [data, setData] = useState<InstagramData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("static");
  const [reelLink, setReelLink] = useState("");
  const [reelLoading, setReelLoading] = useState(false);
  const [reelError, setReelError] = useState("");

  const handleAnalyze = async () => {
    if (!jsonInput.trim()) {
      setError("Please enter JSON data");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const parsedData = JSON.parse(jsonInput);
      setData(parsedData);
    } catch (err) {
      setError("Invalid JSON format. Please check your input.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchReel = async () => {
    setReelError("");
    if (!reelLink.trim()) {
      setReelError("Please enter a Reel link.");
      return;
    }
    setReelLoading(true);
    try {
      // Use the exact fetch syntax provided by the user
      const response = await fetch("http://localhost:5001/scrape?url=" + encodeURIComponent(reelLink.trim()));
      if (!response.ok) {
        throw new Error(`Failed to fetch data for the provided link.`);
      }
      const json = await response.json();
      setJsonInput(JSON.stringify(json, null, 2));
      setError("");
    } catch (err: any) {
      setReelError(err.message || "Failed to fetch data for the provided link.");
    } finally {
      setReelLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!data) return;

    setLoading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `instagram-analytics-${data.username}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Instagram Analytics Dashboard</h1>
          <p className="text-gray-600">Advanced analytics and insights for Instagram content</p>
        </div>

        <ApiKeySetup />

        {/* Reel Link Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Instagram Reel Link
            </CardTitle>
            <CardDescription>Paste an Instagram Reel link to auto-fetch its JSON data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your Instagram Reel link here..."
              value={reelLink}
              onChange={(e) => setReelLink(e.target.value)}
              className="min-h-[40px] font-mono text-sm"
              disabled={reelLoading}
            />
            {reelError && (
              <Alert variant="destructive">
                <AlertDescription>{reelError}</AlertDescription>
              </Alert>
            )}
            <Button
              onClick={handleFetchReel}
              disabled={reelLoading || !reelLink.trim()}
              className="flex items-center gap-2"
            >
              {reelLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Fetch Reel Data
            </Button>
          </CardContent>
        </Card>

        {/* JSON Data Input */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              JSON Data Input
            </CardTitle>
            <CardDescription>Paste your Instagram post JSON data below to get detailed analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your Instagram JSON data here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={loading || !jsonInput.trim()}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                Analyze Data
              </Button>

              {data && (
                <Button
                  variant="outline"
                  onClick={downloadPDF}
                  disabled={loading}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {data && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full">
              <TabsTrigger value="static" className="flex items-center gap-1">
                <Upload className="w-4 h-4" />
                <span className="hidden sm:inline">Static</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Sentiment</span>
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Comments</span>
              </TabsTrigger>
              <TabsTrigger value="hashtags" className="flex items-center gap-1">
                <Hash className="w-4 h-4" />
                <span className="hidden sm:inline">Hashtags</span>
              </TabsTrigger>
              <TabsTrigger value="timing" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Timing</span>
              </TabsTrigger>
              <TabsTrigger value="creators" className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Creators</span>
              </TabsTrigger>
              <TabsTrigger value="category" className="flex items-center gap-1">
                <Category className="w-4 h-4" />
                <span className="hidden sm:inline">Category</span>
              </TabsTrigger>
              <TabsTrigger value="virality" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Virality</span>
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-1">
                <GitCompare className="w-4 h-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="static">
              <StaticDataDisplay data={data} />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceAnalytics data={data} />
            </TabsContent>

            <TabsContent value="sentiment">
              <SentimentAnalysis data={data} />
            </TabsContent>

            <TabsContent value="comments">
              <CommentAnalysis data={data} />
            </TabsContent>

            <TabsContent value="hashtags">
              <HashtagAnalysis data={data} />
            </TabsContent>

            <TabsContent value="timing">
              <PostTimingAnalysis data={data} />
            </TabsContent>

            <TabsContent value="creators">
              <CreatorRecommendations data={data} />
            </TabsContent>

            <TabsContent value="category">
              <ContentCategoryDetection data={data} />
            </TabsContent>

            <TabsContent value="virality">
              <ViralityPrediction data={data} />
            </TabsContent>

            <TabsContent value="compare">
              <CompareReels />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
