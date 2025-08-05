import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnsplashImageSearch } from "@/components/UnsplashImageSearch";
import { VideoTemplateGallery } from "@/components/VideoTemplateGallery";
import VideoGenerationDialog from "@/components/VideoGenerationDialog";
import { Play, Image, Sparkles } from "lucide-react";

export const MediaStudio = () => {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageAlt, setSelectedImageAlt] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleImageSelect = (imageUrl: string, alt: string) => {
    setSelectedImage(imageUrl);
    setSelectedImageAlt(alt);
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Media Studio</h1>
          <p className="text-xl text-muted-foreground">
            Create amazing videos with AI avatars, templates, and stock images
          </p>
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Video Templates
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Stock Images
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Video Generator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Templates & Examples</CardTitle>
                <CardDescription>
                  Choose from pre-made templates or get inspired by example videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoTemplateGallery 
                  onTemplateSelect={handleTemplateSelect}
                  showVideos={true}
                />
                {selectedTemplate && (
                  <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-lg mb-2">Selected Template: {selectedTemplate.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{selectedTemplate.description}</p>
                    <div className="text-sm">
                      <p><strong>Category:</strong> {selectedTemplate.category}</p>
                      <p><strong>Style:</strong> {selectedTemplate.style_preset}</p>
                      <p><strong>Estimated Duration:</strong> {selectedTemplate.duration_estimate}s</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Unsplash Stock Images</CardTitle>
                <CardDescription>
                  Search and select high-quality images for your videos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UnsplashImageSearch onImageSelect={handleImageSelect} />
                {selectedImage && (
                  <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold text-lg mb-2">Selected Image</h3>
                    <div className="flex items-center gap-4">
                      <img 
                        src={selectedImage} 
                        alt={selectedImageAlt}
                        className="w-24 h-24 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm text-muted-foreground">{selectedImageAlt}</p>
                        <p className="text-xs text-muted-foreground mt-1">Ready to use in video generation</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Video Generator</CardTitle>
                <CardDescription>
                  Create talking videos using D-ID AI technology
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Selected Resources</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Template:</strong> {selectedTemplate ? selectedTemplate.name : 'None selected'}</p>
                        <p><strong>Background Image:</strong> {selectedImage ? 'Image selected' : 'None selected'}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Quick Actions</h3>
                      <div className="space-y-2">
                        <VideoGenerationDialog>
                          <Button className="w-full">
                            Start Video Generation
                          </Button>
                        </VideoGenerationDialog>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-2">How to Create Your Video</h3>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Choose a template from the Templates tab (optional)</li>
                      <li>Select a background image from the Stock Images tab (optional)</li>
                      <li>Click "Start Video Generation" to configure your avatar and script</li>
                      <li>Wait for the AI to generate your personalized video</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};