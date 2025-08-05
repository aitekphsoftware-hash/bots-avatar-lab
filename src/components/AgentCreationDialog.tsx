import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Bot, User, Settings } from "lucide-react";
import { didApi } from "@/lib/d-id-api";
import { tokenTracker } from "@/lib/token-tracking";
import { useToast } from "@/hooks/use-toast";
import UserAvatarSelector from "./UserAvatarSelector";

interface AgentCreationDialogProps {
  children: React.ReactNode;
}

export default function AgentCreationDialog({ children }: AgentCreationDialogProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [agentPersonality, setAgentPersonality] = useState("");
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState("");
  const [voiceType, setVoiceType] = useState("microsoft");
  const [gender, setGender] = useState<"male" | "female">("female");
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!agentName.trim() || !agentDescription.trim() || !selectedAvatarUrl) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select an avatar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      
      // Track token usage for agent creation
      tokenTracker.recordUsage("current-user", 1000, "agent_creation");
      
      const agentData = {
        name: agentName,
        source_url: selectedAvatarUrl,
        gender,
        driver_id: "Vcq0R4a8F0" // Default driver for talking
      };

      const result = await didApi.createAgent(agentData);
      
      toast({
        title: "Agent Creation Started",
        description: `Agent "${agentName}" is being created. You'll be notified when it's ready.`,
      });

      setOpen(false);
      
      // Reset form
      setAgentName("");
      setAgentDescription("");
      setAgentPersonality("");
      setSelectedAvatarUrl("");
      
    } catch (error) {
      console.error("Agent creation error:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create agent. Please try again.",
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
            <Bot className="w-5 h-5" />
            Create AI Agent
          </DialogTitle>
          <DialogDescription>
            Build a conversational AI agent with a custom avatar and personality.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">Agent Name *</Label>
              <Input
                id="agentName"
                placeholder="Enter your agent's name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentDescription">Description *</Label>
              <Textarea
                id="agentDescription"
                placeholder="Describe what your agent does and how it helps users"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agentPersonality">Personality & Instructions</Label>
              <Textarea
                id="agentPersonality"
                placeholder="Define your agent's personality, tone, and specific instructions for conversations"
                value={agentPersonality}
                onChange={(e) => setAgentPersonality(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* Avatar Selection */}
          <div className="space-y-3">
            <Label>Avatar Selection *</Label>
            <UserAvatarSelector 
              onAvatarSelect={setSelectedAvatarUrl}
              selectedAvatarUrl={selectedAvatarUrl}
              showUploadButton={true}
            />
          </div>

          {/* Agent Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Voice Type</Label>
              <Select value={voiceType} onValueChange={setVoiceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="elevenlabs">ElevenLabs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={(value: "male" | "female") => setGender(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Features */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Agent Features</h4>
            <div className="grid grid-cols-2 gap-2">
              <Badge variant="outline" className="justify-start">
                <Settings className="w-3 h-3 mr-1" />
                Custom Personality
              </Badge>
              <Badge variant="outline" className="justify-start">
                <User className="w-3 h-3 mr-1" />
                Avatar Integration
              </Badge>
              <Badge variant="outline" className="justify-start">
                <Bot className="w-3 h-3 mr-1" />
                AI Conversations
              </Badge>
              <Badge variant="outline" className="justify-start">
                <Settings className="w-3 h-3 mr-1" />
                Voice Synthesis
              </Badge>
            </div>
          </div>

          {/* Cost Info */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Cost:</strong> €1.00 (1000 tokens) per agent creation
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreate} 
            disabled={!agentName.trim() || !agentDescription.trim() || !selectedAvatarUrl || creating}
            className="gap-2"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
            Create Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}