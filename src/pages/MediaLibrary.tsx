import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnsplashImageSearch } from "@/components/UnsplashImageSearch";
import { VideoTemplateGallery } from "@/components/VideoTemplateGallery";
import { toast } from "sonner";

export const MediaLibrary = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const handleImageSelect = (imageUrl: string, alt: string) => {
    setSelectedImage(imageUrl);
    toast.success("Image selected! You can now use it in your video generation.");
  };

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    toast.success(`Template "${template.name}" selected!`);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground">
          Search for images and explore video templates for your D-ID projects
        </p>
      </div>

      <Tabs defaultValue="images" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="images">Image Search</TabsTrigger>
          <TabsTrigger value="templates">Video Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unsplash Image Search</CardTitle>
              <CardDescription>
                Search millions of high-quality, royalty-free images from Unsplash
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UnsplashImageSearch 
                onImageSelect={handleImageSelect}
                orientation="landscape"
              />
            </CardContent>
          </Card>

          {selectedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="max-w-xs rounded-lg shadow-md"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This image has been copied to your clipboard and can be used in video generation.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Templates & Examples</CardTitle>
              <CardDescription>
                Browse professional video templates and example videos for inspiration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VideoTemplateGallery 
                onTemplateSelect={handleTemplateSelect}
                showVideos={true}
              />
            </CardContent>
          </Card>

          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle>Selected Template: {selectedTemplate.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {selectedTemplate.description}
                  </p>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-mono">
                      {selectedTemplate.script_template}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Replace the variables in curly braces (e.g., {"{name}"}) with your actual content.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};