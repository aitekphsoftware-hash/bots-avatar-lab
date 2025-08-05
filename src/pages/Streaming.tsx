import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Radio, Users, Play, Settings } from "lucide-react";
import StreamCreationDialog from "@/components/StreamCreationDialog";

interface Stream {
  id: string;
  title: string;
  description: string;
  status: "live" | "scheduled" | "ended";
  viewers: number;
  duration: string;
  thumbnail: string;
  created: string;
}

export default function Streaming() {
  const [searchTerm, setSearchTerm] = useState("");
  const [streams, setStreams] = useState<Stream[]>([
    {
      id: "1",
      title: "Product Demo Live",
      description: "Demonstrating our new features with AI avatar",
      status: "live",
      viewers: 45,
      duration: "01:23:45",
      thumbnail: "/placeholder.svg",
      created: "2 hours ago"
    },
    {
      id: "2",
      title: "Weekly Team Update",
      description: "Company updates and Q&A session",
      status: "scheduled",
      viewers: 0,
      duration: "00:00:00",
      thumbnail: "/placeholder.svg",
      created: "1 day ago"
    },
    {
      id: "3",
      title: "Customer Support Training",
      description: "Training session for new support team members",
      status: "ended",
      viewers: 28,
      duration: "00:45:30",
      thumbnail: "/placeholder.svg",
      created: "3 days ago"
    }
  ]);

  const filteredStreams = streams.filter(stream =>
    stream.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stream.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live": return "bg-red-100 text-red-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "ended": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live": return <Radio className="w-3 h-3 mr-1" />;
      case "scheduled": return <Settings className="w-3 h-3 mr-1" />;
      case "ended": return <Play className="w-3 h-3 mr-1" />;
      default: return <Settings className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search streams"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
          <StreamCreationDialog>
            <Button variant="blue" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Stream
            </Button>
          </StreamCreationDialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Create Stream Card */}
        <Card className="mb-8 border-2 border-dashed border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Radio className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Your First Live Stream</h3>
            <p className="text-muted-foreground mb-4 text-center max-w-md">
              Create engaging live streams with AI avatars for product demos, training sessions, and interactive content.
            </p>
            <StreamCreationDialog>
              <Button variant="blue" size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Stream
              </Button>
            </StreamCreationDialog>
          </CardContent>
        </Card>

        {/* Streams Grid */}
        {filteredStreams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredStreams.map((stream) => (
              <Card key={stream.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <div className="aspect-video relative rounded-t-lg overflow-hidden bg-muted">
                  <img src={stream.thumbnail} alt={stream.title} className="w-full h-full object-cover" />
                  {stream.status === "live" && (
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-red-500 text-white animate-pulse">
                        <Radio className="w-3 h-3 mr-1" />
                        LIVE
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white px-2 py-1 rounded text-xs">
                    {stream.duration}
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{stream.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(stream.status)}`}>
                          {getStatusIcon(stream.status)}
                          {stream.status}
                        </Badge>
                        {stream.status === "live" && (
                          <Badge variant="outline" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {stream.viewers} viewers
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3 line-clamp-2">{stream.description}</CardDescription>
                  <p className="text-xs text-muted-foreground">Created {stream.created}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredStreams.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No streams found matching your search.</p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Streaming Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <Radio className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Live Streaming</CardTitle>
                <CardDescription>
                  Stream in real-time with HD quality and low latency for engaging experiences
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Interactive Features</CardTitle>
                <CardDescription>
                  Engage with your audience through live chat, polls, and Q&A sessions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Advanced Controls</CardTitle>
                <CardDescription>
                  Manage your streams with scheduling, recording, and analytics tools
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}