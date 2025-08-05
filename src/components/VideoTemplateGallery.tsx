import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Play, Clock, Search, Filter } from "lucide-react";
import { toast } from "sonner";

interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail_url?: string;
  script_template: string;
  background_type: string;
  background_value?: string;
  style_preset: string;
  duration_estimate: number;
  tags: string[];
  is_premium: boolean;
}

interface PublicVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  category: string;
  duration?: number;
  tags: string[];
  view_count: number;
  is_featured: boolean;
}

interface VideoTemplateGalleryProps {
  onTemplateSelect?: (template: VideoTemplate) => void;
  onVideoSelect?: (video: PublicVideo) => void;
  showVideos?: boolean;
}

export const VideoTemplateGallery = ({ 
  onTemplateSelect, 
  onVideoSelect, 
  showVideos = true 
}: VideoTemplateGalleryProps) => {
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [videos, setVideos] = useState<PublicVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"templates" | "videos">("templates");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "business", label: "Business" },
    { value: "marketing", label: "Marketing" },
    { value: "education", label: "Education" },
    { value: "announcement", label: "Announcements" },
    { value: "welcome", label: "Welcome" },
    { value: "news", label: "News" },
    { value: "sales", label: "Sales" },
    { value: "gratitude", label: "Thank You" }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock templates data for now (until Supabase types are updated)
      const mockTemplates: VideoTemplate[] = [
        {
          id: "1",
          name: "Business Introduction",
          description: "Professional introduction template for business purposes",
          category: "business",
          script_template: "Hello, I'm {name} and I'm excited to introduce our company {company}. We specialize in {specialty} and have been serving clients for {years} years. Our mission is to {mission}. Thank you for your time!",
          background_type: "solid",
          style_preset: "professional",
          duration_estimate: 30,
          tags: ["business", "introduction", "corporate"],
          is_premium: false
        },
        {
          id: "2",
          name: "Product Demo",
          description: "Showcase your product features and benefits",
          category: "marketing",
          script_template: "Introducing {product_name} - the {description}. Key features include {feature1}, {feature2}, and {feature3}. With {product_name}, you can {benefit1} and {benefit2}. Try it today and see the difference!",
          background_type: "solid",
          style_preset: "professional",
          duration_estimate: 45,
          tags: ["product", "demo", "marketing", "sales"],
          is_premium: false
        },
        {
          id: "3",
          name: "Educational Explainer",
          description: "Explain complex topics in simple terms",
          category: "education",
          script_template: "Today we're going to learn about {topic}. {topic} is important because {importance}. Let me break this down into simple steps: First, {step1}. Second, {step2}. Finally, {step3}. Remember, {key_takeaway}.",
          background_type: "solid",
          style_preset: "casual",
          duration_estimate: 60,
          tags: ["education", "tutorial", "explainer"],
          is_premium: false
        },
        {
          id: "4",
          name: "Sales Pitch",
          description: "Compelling sales presentation template",
          category: "sales",
          script_template: "Are you struggling with {problem}? You're not alone. {statistic} of people face this challenge. That's why we created {solution}. With {solution}, you can {benefit1}, {benefit2}, and save {savings}. Don't wait - {call_to_action}!",
          background_type: "gradient",
          style_preset: "professional",
          duration_estimate: 40,
          tags: ["sales", "pitch", "marketing", "conversion"],
          is_premium: true
        },
        {
          id: "5",
          name: "Welcome Message",
          description: "Warm welcome for new customers or team members",
          category: "welcome",
          script_template: "Welcome to {organization}! We're so glad you're here. As a new {role}, you'll be working with {team} on {projects}. Your first step is to {first_step}. If you have any questions, feel free to reach out to {contact}. Welcome aboard!",
          background_type: "solid",
          style_preset: "casual",
          duration_estimate: 35,
          tags: ["welcome", "onboarding", "introduction"],
          is_premium: false
        },
        {
          id: "6",
          name: "Thank You Message",
          description: "Express gratitude to customers or partners",
          category: "gratitude",
          script_template: "Thank you so much for {reason}. Your {action} means the world to us. Because of supporters like you, we've been able to {achievement}. We're committed to {commitment} and look forward to {future_plans}. Thank you again!",
          background_type: "solid",
          style_preset: "casual",
          duration_estimate: 25,
          tags: ["thanks", "gratitude", "appreciation"],
          is_premium: false
        }
      ];

      setTemplates(mockTemplates);

      // Mock videos data for now
      if (showVideos) {
        const mockVideos: PublicVideo[] = [
          {
            id: "1",
            title: "Business Introduction Example",
            description: "See how a professional business introduction looks",
            video_url: "https://example.com/business-intro.mp4",
            thumbnail_url: "https://example.com/business-intro-thumb.jpg",
            category: "example",
            duration: 35,
            tags: ["business", "example", "introduction"],
            view_count: 1250,
            is_featured: true
          },
          {
            id: "2", 
            title: "Product Demo Example",
            description: "Watch this product demonstration in action",
            video_url: "https://example.com/product-demo.mp4",
            thumbnail_url: "https://example.com/product-demo-thumb.jpg",
            category: "example",
            duration: 50,
            tags: ["product", "demo", "example"],
            view_count: 890,
            is_featured: false
          },
          {
            id: "3",
            title: "Educational Content Example",
            description: "Learn how to create engaging educational videos",
            video_url: "https://example.com/education.mp4",
            thumbnail_url: "https://example.com/education-thumb.jpg",
            category: "example",
            duration: 75,
            tags: ["education", "tutorial", "example"],
            view_count: 645,
            is_featured: false
          }
        ];

        setVideos(mockVideos);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load templates and videos');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (template: VideoTemplate) => {
    if (onTemplateSelect) {
      onTemplateSelect(template);
      toast.success(`Template "${template.name}" selected!`);
    }
  };

  const handleVideoSelect = async (video: PublicVideo) => {
    // For now, just call the callback without updating database
    if (onVideoSelect) {
      onVideoSelect(video);
      toast.success(`Video "${video.title}" selected!`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates and videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab Navigation */}
      {showVideos && (
        <div className="flex border-b">
          <Button
            variant={activeTab === "templates" ? "default" : "ghost"}
            onClick={() => setActiveTab("templates")}
            className="rounded-b-none"
          >
            Templates ({filteredTemplates.length})
          </Button>
          <Button
            variant={activeTab === "videos" ? "default" : "ghost"}
            onClick={() => setActiveTab("videos")}
            className="rounded-b-none"
          >
            Example Videos ({filteredVideos.length})
          </Button>
        </div>
      )}

      {/* Templates Section */}
      {(activeTab === "templates" || !showVideos) && (
        <ScrollArea className="h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    {template.is_premium && (
                      <Badge variant="secondary" className="ml-2">Premium</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>~{template.duration_estimate}s</span>
                    <Badge variant="outline" className="capitalize">
                      {template.style_preset}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {template.script_template.substring(0, 100)}...
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No templates found matching your criteria.
            </div>
          )}
        </ScrollArea>
      )}

      {/* Videos Section */}
      {showVideos && activeTab === "videos" && (
        <ScrollArea className="h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <Card 
                key={video.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleVideoSelect(video)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{video.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {video.description}
                      </CardDescription>
                    </div>
                    {video.is_featured && (
                      <Badge className="ml-2">Featured</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Play className="w-4 h-4" />
                    <span>{video.view_count} views</span>
                    {video.duration && (
                      <>
                        <span>•</span>
                        <span>{video.duration}s</span>
                      </>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {video.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {video.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{video.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredVideos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No videos found matching your criteria.
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};