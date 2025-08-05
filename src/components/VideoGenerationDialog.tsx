import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Loader2, Play, User } from "lucide-react";
import { didApi, Avatar, VideoRequest } from "@/lib/d-id-api";
import { tokenTracker } from "@/lib/token-tracking";
import { useToast } from "@/hooks/use-toast";
import UserAvatarSelector from "./UserAvatarSelector";

interface VideoGenerationDialogProps {
  children: React.ReactNode;
  selectedAvatar?: Avatar;
}

export default function VideoGenerationDialog({ children, selectedAvatar }: VideoGenerationDialogProps) {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [script, setScript] = useState("");
  const [voiceProvider, setVoiceProvider] = useState<"microsoft" | "amazon">("microsoft");
  const [voiceId, setVoiceId] = useState("en-US-JennyNeural");
  const [subtitles, setSubtitles] = useState(true);
  const [fluent, setFluent] = useState(true);
  const [useUserAvatar, setUseUserAvatar] = useState(false);
  const [selectedUserAvatarUrl, setSelectedUserAvatarUrl] = useState<string>("");
  const { toast } = useToast();

  const microsoftVoices = [
    { id: "en-US-JennyNeural", name: "Jenny (Female, US)" },
    { id: "en-US-GuyNeural", name: "Guy (Male, US)" },
    { id: "en-US-AriaNeural", name: "Aria (Female, US)" },
    { id: "en-GB-SoniaNeural", name: "Sonia (Female, UK)" },
    { id: "en-GB-RyanNeural", name: "Ryan (Male, UK)" },
  ];

  const amazonVoices = [
    { id: "Joanna", name: "Joanna (Female, US)" },
    { id: "Matthew", name: "Matthew (Male, US)" },
    { id: "Amy", name: "Amy (Female, UK)" },
    { id: "Brian", name: "Brian (Male, UK)" },
    { id: "Emma", name: "Emma (Female, UK)" },
  ];

  const handleGenerate = async () => {
    // Determine which avatar to use
    const avatarUrl = useUserAvatar ? selectedUserAvatarUrl : selectedAvatar?.image_url;
    
    if (!avatarUrl || !script.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select an avatar and enter a script.",
        variant: "destructive",
      });
      return;
    }

    try {
      setGenerating(true);
      
      // Track token usage for video generation
      tokenTracker.recordUsage("current-user", 800, "video_generation");
      
      const request: VideoRequest = {
        script: {
          type: "text",
          input: script,
          subtitles,
          provider: {
            type: voiceProvider,
            voice_id: voiceId,
          },
        },
        config: {
          fluent,
          pad_audio: 0.1,
          stitch: true,
        },
        source_url: avatarUrl,
      };

      const result = await didApi.createTalk(request);
      
      toast({
        title: "Video Generation Started",
        description: `Video ID: ${result.id}. We'll notify you when it's ready.`,
      });

      setOpen(false);
      
      // Reset form
      setScript("");
      setSubtitles(true);
      setFluent(true);
      
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Generate Video
          </DialogTitle>
          <DialogDescription>
            Create a talking video with {selectedAvatar?.name || "selected avatar"}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Avatar Selection */}
          <Tabs defaultValue="preset" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preset" onClick={() => setUseUserAvatar(false)}>
                Preset Avatars
              </TabsTrigger>
              <TabsTrigger value="custom" onClick={() => setUseUserAvatar(true)}>
                <User className="w-4 h-4 mr-2" />
                Your Avatars
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preset" className="space-y-4">
              {/* Selected Preset Avatar Preview */}
              {selectedAvatar && !useUserAvatar && (
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <img 
                    src={selectedAvatar.image_url} 
                    alt={selectedAvatar.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedAvatar.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedAvatar.gender} • {selectedAvatar.style}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <UserAvatarSelector 
                onAvatarSelect={setSelectedUserAvatarUrl}
                selectedAvatarUrl={selectedUserAvatarUrl}
                showUploadButton={true}
              />
            </TabsContent>
          </Tabs>

          {/* Script Input */}
          <div className="space-y-2">
            <Label htmlFor="script">Script</Label>
            <Textarea
              id="script"
              placeholder="Enter the text you want your avatar to say..."
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {script.length}/500 characters
            </p>
          </div>

          {/* Voice Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Voice Provider</Label>
              <Select value={voiceProvider} onValueChange={(value: "microsoft" | "amazon") => setVoiceProvider(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Voice</Label>
              <Select value={voiceId} onValueChange={setVoiceId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(voiceProvider === "microsoft" ? microsoftVoices : amazonVoices).map((voice) => (
                    <SelectItem key={voice.id} value={voice.id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="subtitles">Include Subtitles</Label>
              <Switch
                id="subtitles"
                checked={subtitles}
                onCheckedChange={setSubtitles}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="fluent">Fluent Speech</Label>
              <Switch
                id="fluent"
                checked={fluent}
                onCheckedChange={setFluent}
              />
            </div>
          </div>

          {/* Cost Info */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              <strong>Cost:</strong> €0.80 (800 tokens) per video generation
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={(!selectedAvatar && !useUserAvatar) || (useUserAvatar && !selectedUserAvatarUrl) || !script.trim() || generating}
            className="gap-2"
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Generate Video
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}