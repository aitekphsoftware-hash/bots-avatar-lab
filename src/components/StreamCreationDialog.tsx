import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Radio, Users, Settings, Play } from "lucide-react";
import { didApi } from "@/lib/d-id-api";
import { tokenTracker } from "@/lib/token-tracking";
import { useToast } from "@/hooks/use-toast";
import UserAvatarSelector from "./UserAvatarSelector";

interface StreamCreationDialogProps {
  children: React.ReactNode;
}

export default function StreamCreationDialog({ children }: StreamCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState("");
  const [streamType, setStreamType] = useState("live");
  const [isPublic, setIsPublic] = useState(true);
  const [autoRecord, setAutoRecord] = useState(true);
  const [quality, setQuality] = useState("1080p");
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!streamTitle.trim() || !streamDescription.trim() || !selectedAvatarUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select an avatar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      
      // Track token usage for stream creation
      tokenTracker.recordUsage("current-user", 500, "stream_creation");
      
      // Simulate stream creation (replace with actual API call)
      const streamData = {
        title: streamTitle,
        description: streamDescription,
        avatar_url: selectedAvatarUrl,
        type: streamType,
        public: isPublic,
        auto_record: autoRecord,
        quality: quality
      };

      // Mock API call - replace with actual stream creation endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Stream Created Successfully",
        description: `Stream "${streamTitle}" has been created and is ready to go live.`,
      });

      setOpen(false);
      
      // Reset form
      setStreamTitle("");
      setStreamDescription("");
      setSelectedAvatarUrl("");
      
    } catch (error) {
      console.error("Stream creation error:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create stream. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Create Live Stream
          </DialogTitle>
          <DialogDescription>
            Set up a live stream with your AI avatar for real-time interactions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="streamTitle">Stream Title *</Label>
              <Input
                id="streamTitle"
                placeholder="Enter your stream title"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streamDescription">Description *</Label>
              <Textarea
                id="streamDescription"
                placeholder="Describe what your stream is about"
                value={streamDescription}
                onChange={(e) => setStreamDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label>Stream Avatar *</Label>
            <UserAvatarSelector 
              onAvatarSelect={setSelectedAvatarUrl}
              selectedAvatarUrl={selectedAvatarUrl}
              showUploadButton={true}
            />
          </div>

          {/* Stream Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Stream Type</Label>
              <Select value={streamType} onValueChange={setStreamType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="live">Live Stream</SelectItem>
                  <SelectItem value="scheduled">Scheduled Stream</SelectItem>
                  <SelectItem value="ondemand">On-Demand</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quality</Label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p Full HD</SelectItem>
                  <SelectItem value="4k">4K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stream Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Public Stream</Label>
                <p className="text-sm text-muted-foreground">Allow anyone to view your stream</p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Auto-Record</Label>
                <p className="text-sm text-muted-foreground">Automatically save stream recordings</p>
              </div>
              <Switch
                checked={autoRecord}
                onCheckedChange={setAutoRecord}
              />
            </div>
          </div>

          {/* Features */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Stream Features</h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-start">
                <Play className="w-3 h-3 mr-1" />
                Real-time Streaming
              </Badge>
              <Badge variant="outline" className="justify-start">
                <Users className="w-3 h-3 mr-1" />
                Live Chat
              </Badge>
              <Badge variant="outline" className="justify-start">
                <Radio className="w-3 h-3 mr-1" />
                HD Quality
              </Badge>
              <Badge variant="outline" className="justify-start">
                <Settings className="w-3 h-3 mr-1" />
                Custom Settings
              </Badge>
            </div>
          </div>

          {/* Cost Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Cost:</strong> €0.50 (500 tokens) per stream creation + usage-based pricing
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!streamTitle.trim() || !streamDescription.trim() || !selectedAvatarUrl || creating}
            className="gap-2"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Radio className="w-4 h-4" />
            )}
            Create Stream
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}