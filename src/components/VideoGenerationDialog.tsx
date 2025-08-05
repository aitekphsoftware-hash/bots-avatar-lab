import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Video, Loader2, Play } from "lucide-react";
import { didApi, Avatar, VideoRequest } from "@/lib/d-id-api";
import { tokenTracker } from "@/lib/token-tracking";
import { useToast } from "@/hooks/use-toast";

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
    if (!selectedAvatar || !script.trim()) {
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
        source_url: selectedAvatar.image_url,
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
      <DialogContent className="sm:max-w-[600px]">
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
          {/* Selected Avatar Preview */}
          {selectedAvatar && (
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
            disabled={!selectedAvatar || !script.trim() || generating}
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