import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Upload, Video } from "lucide-react";
import { didApi, Avatar } from "@/lib/d-id-api";
import AvatarCard from "@/components/AvatarCard";
import { useToast } from "@/hooks/use-toast";

export default function Avatars() {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadAvatars();
  }, []);

  const loadAvatars = async () => {
    try {
      setLoading(true);
      const response = await didApi.getAvatars();
      setAvatars(response);
    } catch (error) {
      console.error("Error loading avatars:", error);
      toast({
        title: "Error",
        description: "Failed to load avatars. Please try again.",
        variant: "destructive",
      });
      // Add some mock avatars for demo purposes
      setAvatars([
        {
          id: "1000162710",
          name: "Adam",
          image_url: "/placeholder.svg",
          gender: "male",
          age_group: "adult",
          style: "standard"
        },
        {
          id: "20250804_162614_0000",
          name: "Bold",
          image_url: "/placeholder.svg",
          gender: "male",
          age_group: "adult",
          style: "standard"
        },
        {
          id: "95e0e217_f48b_4234_acc9_6aac90fbb",
          name: "Damian",
          image_url: "/placeholder.svg",
          gender: "male",
          age_group: "adult",
          style: "standard"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAvatars = avatars.filter(avatar => {
    const matchesSearch = avatar.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === "all" || 
                      (selectedTab === "my-avatars" && false) || // No custom avatars yet
                      (selectedTab === "premium" && avatar.style === "premium") ||
                      (selectedTab === "standard" && avatar.style === "standard");
    return matchesSearch && matchesTab;
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
            <Button variant="outline" className="gap-2">
              <span>✨</span>
              Generate from Text
            </Button>
          </div>
          <Button variant="orange" className="gap-2">
            <Plus className="w-4 h-4" />
            Create Avatar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
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
              <Button variant="orange">Upload photo</Button>
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

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="my-avatars">My Avatars</TabsTrigger>
            <TabsTrigger value="premium">Premium +</TabsTrigger>
            <TabsTrigger value="standard">Standard</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {/* My Avatars section */}
            {selectedTab === "my-avatars" && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">My Avatars</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="border-2 border-dashed border-muted rounded-lg aspect-[3/4] flex flex-col items-center justify-center gap-2 hover:bg-muted/50 cursor-pointer transition-colors">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Create Avatar</span>
                  </div>
                </div>
              </div>
            )}

            {/* D-ID Avatars section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {selectedTab === "all" ? "D-ID Avatars" : `${selectedTab === "premium" ? "Premium" : "Standard"} Avatars`}
              </h3>
              
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg aspect-[3/4] mb-2"></div>
                      <div className="bg-muted rounded h-4 mb-1"></div>
                      <div className="bg-muted rounded h-3 w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {filteredAvatars.map((avatar) => (
                    <AvatarCard
                      key={avatar.id}
                      avatar={avatar}
                      showCreateButton={true}
                    />
                  ))}
                </div>
              )}
            </div>

            {filteredAvatars.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No avatars found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}