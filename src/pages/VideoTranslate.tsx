import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Video, Languages, Sparkles } from "lucide-react";

export default function VideoTranslate() {
  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Video Translate</h1>
          <Button variant="blue" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Video
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Translate Your Videos Instantly</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Transform your videos into multiple languages with AI-powered translation and lip-sync technology
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center">
                <Languages className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Multi-Language Support</CardTitle>
                <CardDescription>
                  Translate to over 100 languages with natural voice synthesis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Video className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Perfect Lip Sync</CardTitle>
                <CardDescription>
                  Advanced AI ensures perfect lip synchronization in target language
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Voice Cloning</CardTitle>
                <CardDescription>
                  Maintain the original speaker's voice characteristics across languages
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Upload Section */}
          <Card className="border-2 border-dashed border-muted-foreground/25">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Upload Your Video</h3>
              <p className="text-muted-foreground mb-4 text-center max-w-md">
                Drag and drop your video file here, or click to browse. Supports MP4, MOV, AVI formats up to 100MB.
              </p>
              <Button variant="blue" size="lg" className="gap-2">
                <Upload className="w-4 h-4" />
                Choose File
              </Button>
            </CardContent>
          </Card>

          {/* Process Steps */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 text-center">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-3">
                  1
                </div>
                <h4 className="font-medium mb-2">Upload Video</h4>
                <p className="text-sm text-muted-foreground">Upload your original video content</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-3">
                  2
                </div>
                <h4 className="font-medium mb-2">Select Language</h4>
                <p className="text-sm text-muted-foreground">Choose target languages for translation</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-3">
                  3
                </div>
                <h4 className="font-medium mb-2">AI Processing</h4>
                <p className="text-sm text-muted-foreground">Our AI translates and syncs the video</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-semibold mx-auto mb-3">
                  4
                </div>
                <h4 className="font-medium mb-2">Download</h4>
                <p className="text-sm text-muted-foreground">Get your translated videos instantly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}