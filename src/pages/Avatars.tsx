import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Upload, Video, Play } from "lucide-react";
import AvatarModal from "@/components/AvatarModal";
import ImageUploadDialog from "@/components/ImageUploadDialog";
import TokenUsageWidget from "@/components/TokenUsageWidget";
import { useToast } from "@/hooks/use-toast";

interface Presenter {
  presenter_id: string;
  name: string;
  gender: string;
  preview_url: string;
  talking_preview_url: string;
  thumbnail_url: string;
  image_url: string;
  voice?: {
    type: string;
    voice_id: string;
  };
}

const cleanAvatarName = (name: string) => {
  // Remove everything after @ symbol and any version prefixes
  return name.replace(/^v\d+_public_/, "").split("@")[0].replace(/_/g, " ");
};

export default function Avatars() {
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadPresenters();
  }, []);

  const loadPresenters = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.d-id.com/clips/presenters", {
        headers: {
          "accept": "application/json",
          "authorization": "Basic Y29kZXh4eGhvc3RAZ21haWwuY29t:259e8IoCoDHpSrJ_Qwe9n"
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPresenters(data.presenters || []);
      } else {
        throw new Error("Failed to fetch presenters");
      }
    } catch (error) {
      console.error("Error loading presenters:", error);
      toast({
        title: "Error",
        description: "Failed to load avatars. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPresenters = presenters.filter(presenter => {
    const cleanName = cleanAvatarName(presenter.name);
    return cleanName.toLowerCase().includes(searchTerm.toLowerCase()) &&
           (genderFilter === "all" || presenter.gender === genderFilter);
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
                placeholder="Search Avatars"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <Button variant="orange" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Avatar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Token Usage Widget */}
        <div className="mb-6">
          <TokenUsageWidget className="max-w-sm" />
        </div>

        {/* Create Avatar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Create with a photo
              </CardTitle>
              <CardDescription>
                Upload a photo to create talking head videos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUploadDialog>
                <Button variant="orange">Upload photo</Button>
              </ImageUploadDialog>
            </CardContent>
            <div className="absolute top-4 right-4 w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
          </Card>

          <Card className="relative">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Create with a video
              </CardTitle>
              <CardDescription>
                Higher quality video Avatars.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="orange">Create Avatar</Button>
            </CardContent>
            <div className="absolute top-4 right-4 w-16 h-16 bg-muted rounded-lg overflow-hidden">
              <img src="/placeholder.svg" alt="Video avatar" className="w-full h-full object-cover" />
            </div>
          </Card>
        </div>

        {/* Studio Avatars */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Studio Avatars</h3>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg aspect-[4/5] mb-4"></div>
                  <div className="bg-muted rounded h-4 mb-2"></div>
                  <div className="bg-muted rounded h-3 w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPresenters.map((presenter) => (
                <AvatarModal key={presenter.presenter_id} presenter={presenter}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20 bg-card">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={presenter.thumbnail_url}
                        alt={cleanAvatarName(presenter.name)}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-primary/90 text-white p-3 rounded-full">
                            <Play className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{cleanAvatarName(presenter.name)}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant={presenter.gender === "male" ? "default" : "secondary"}>
                          {presenter.gender}
                        </Badge>
                        {presenter.voice && (
                          <Badge variant="outline" className="text-xs">
                            {presenter.voice.type}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-sm">
                        Click to preview this avatar with voice samples and mobile previews
                      </CardDescription>
                    </CardContent>
                  </Card>
                </AvatarModal>
              ))}
            </div>
          )}

          {filteredPresenters.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No avatars found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}