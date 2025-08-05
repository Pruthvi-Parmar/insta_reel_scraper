import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Eye, Heart, MessageCircle, Users, Verified } from "lucide-react"
import Image from "next/image"

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

interface StaticDataDisplayProps {
  data: InstagramData
}

export default function StaticDataDisplay({ data }: StaticDataDisplayProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={data.profile_pic_url || "/placeholder.svg"} alt={data.username} />
              <AvatarFallback>{data.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">@{data.username}</h3>
                {data.verified && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Verified className="w-3 h-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{data.full_name}</p>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                {formatNumber(data.followers)} followers
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Bio</h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">{data.bio}</p>
          </div>
        </CardContent>
      </Card>

      {/* Post Information */}
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Post ID</p>
              <p className="font-mono text-sm">{data.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shortcode</p>
              <p className="font-mono text-sm">{data.shortcode}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              Posted At
            </p>
            <p className="text-sm">{formatDate(data.taken_at)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Method</p>
            <Badge variant="outline">{data.method}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-500 mb-1">
                <Heart className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{formatNumber(data.like_count)}</p>
              <p className="text-sm text-gray-500">Likes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-500 mb-1">
                <MessageCircle className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{formatNumber(data.comment_count)}</p>
              <p className="text-sm text-gray-500">Comments</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-500 mb-1">
                <Eye className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold">{formatNumber(data.view_count)}</p>
              <p className="text-sm text-gray-500">Views</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Media Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={data.image_url || "/placeholder.svg"}
              alt="Post preview"
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=400&width=400&text=Media+Preview"
              }}
            />
          </div>
          {data.video_url && (
            <div className="mt-2">
              <Badge variant="secondary">Video Content</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Caption */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Caption</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-line">{data.caption}</p>
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Comments ({data.comments.length})</CardTitle>
          <CardDescription>Latest comments on this post</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {data.comments.slice(0, 10).map((comment) => (
              <div key={comment.id} className="flex items-start gap-3 p-2 rounded-lg bg-gray-50">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">{comment.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">@{comment.username}</p>
                    {comment.like_count > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Heart className="w-3 h-3" />
                        {comment.like_count}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
