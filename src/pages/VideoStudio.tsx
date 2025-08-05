import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ChevronDown, Play } from "lucide-react";
import { didApi, Avatar } from "@/lib/d-id-api";

interface VideoTemplate {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
  scenes: number;
  premium?: boolean;
}

export default function VideoStudio() {
  const [videos, setVideos] = useState([]);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [aspectRatio, setAspectRatio] = useState("all");
  const [useCase, setUseCase] = useState("all");

  useEffect(() => {
    // Mock templates data
    setTemplates([
      {
        id: "1",
        name: "2024 Product Launch Briefing",
        thumbnail: "/placeholder.svg",
        category: "Corporate",
        scenes: 10,
        premium: false
      },
      {
        id: "2", 
        name: "Team Update Meeting",
        thumbnail: "/placeholder.svg",
        category: "Corporate",
        scenes: 9,
        premium: false
      },
      {
        id: "3",
        name: "Product Demo Presentation",
        thumbnail: "/placeholder.svg",
        category: "Product Demo",
        scenes: 10,
        premium: false
      },
      {
        id: "4",
        name: "Welcome Message",
        thumbnail: "/placeholder.svg",
        category: "Marketing",
        scenes: 7,
        premium: false
      },
      {
        id: "5",
        name: "Don't Let Anyone STEAL YOUR TIME",
        thumbnail: "/placeholder.svg",
        category: "Learning & Development",
        scenes: 8,
        premium: false
      },
      {
        id: "6",
        name: "Hi! I'm Your Talent Partner",
        thumbnail: "/placeholder.svg",
        category: "HR",
        scenes: 5,
        premium: false
      },
      {
        id: "7",
        name: "New Feature Announcement",
        thumbnail: "/placeholder.svg",
        category: "Product Demo",
        scenes: 8,
        premium: false
      },
      {
        id: "8",
        name: "Synood Presentation",
        thumbnail: "/placeholder.svg",
        category: "Corporate",
        scenes: 7,
        premium: false
      }
    ]);

    // Mock videos data
    setVideos([
      { id: "1", name: "Bold", thumbnail: "/placeholder.svg", duration: "00:05", created: "Aug 4, 2025" },
      { id: "2", name: "Damian", thumbnail: "/placeholder.svg", duration: "00:05", created: "Aug 4, 2025" },
      { id: "3", name: "Alloy", thumbnail: "/placeholder.svg", duration: "00:04", created: "Aug 4, 2025" },
      { id: "4", name: "Untitled video", thumbnail: "/placeholder.svg", duration: "00:04", created: "Aug 4, 2025" }
    ]);
  }, []);

  const useCases = [
    "Marketing", "Corporate", "Finance", "Learning & Development", 
    "SAAS", "Product Demo", "Social Media", "Sales", "HR", 
    "Product Management", "Event", "Retail", "R&D", "Events"
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUseCase = useCase === "all" || template.category === useCase;
    return matchesSearch && matchesUseCase;
  });

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search videos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Newest created</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Create Video Button */}
            <div className="mb-8">
              <Button variant="blue" size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Create video
              </Button>
            </div>

            {/* Existing Videos */}
            {videos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Your Videos</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {videos.map((video: any) => (
                    <Card key={video.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="aspect-video relative rounded-t-lg overflow-hidden bg-muted">
                          <img src={video.thumbnail} alt={video.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          <Badge className="absolute bottom-2 right-2 bg-black/80 text-white text-xs">
                            {video.duration}
                          </Badge>
                        </div>
                        <div className="p-3">
                          <p className="font-medium">{video.name}</p>
                          <p className="text-sm text-muted-foreground">Created {video.created}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Templates Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Templates</h3>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button 
                  variant={aspectRatio === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAspectRatio("all")}
                >
                  All
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Aspect ratio</span>
                  <Button variant="outline" size="sm" className="gap-1">
                    All <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">Use case</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={useCase === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseCase("all")}
                  >
                    All
                  </Button>
                  {useCases.map((category) => (
                    <Button
                      key={category}
                      variant={useCase === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setUseCase(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Template Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <div className="aspect-video relative rounded-t-lg overflow-hidden bg-muted">
                        <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <Badge className="absolute bottom-2 right-2 bg-black/80 text-white text-xs">
                          {template.scenes} scenes
                        </Badge>
                        {template.premium && (
                          <Badge className="absolute top-2 left-2 bg-black/80 text-white text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-medium text-sm">{template.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {videos.map((video: any) => (
                <Card key={video.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video relative rounded-t-lg overflow-hidden bg-muted">
                      <img src={video.thumbnail} alt={video.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <Badge className="absolute bottom-2 right-2 bg-black/80 text-white text-xs">
                        {video.duration}
                      </Badge>
                    </div>
                    <div className="p-3">
                      <p className="font-medium">{video.name}</p>
                      <p className="text-sm text-muted-foreground">Created {video.created}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="draft" className="mt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No draft videos found.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
