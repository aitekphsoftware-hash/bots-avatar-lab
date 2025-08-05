import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MessageCircle, Settings, Users, Bot } from "lucide-react";
import AgentCreationDialog from "@/components/AgentCreationDialog";

interface Agent {
  id: string;
  name: string;
  description: string;
  avatar: string;
  status: "active" | "draft" | "inactive";
  conversations: number;
  created: string;
}

export default function Agents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Customer Support Agent",
      description: "Handles customer inquiries and support tickets",
      avatar: "/placeholder.svg",
      status: "active",
      conversations: 156,
      created: "2 days ago"
    },
    {
      id: "2", 
      name: "Sales Assistant",
      description: "Helps with product information and sales inquiries",
      avatar: "/placeholder.svg",
      status: "active",
      conversations: 89,
      created: "1 week ago"
    },
    {
      id: "3",
      name: "HR Onboarding",
      description: "Assists new employees with onboarding process",
      avatar: "/placeholder.svg",
      status: "draft",
      conversations: 0,
      created: "3 days ago"
    }
  ]);

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
          </div>
          <AgentCreationDialog>
            <Button variant="blue" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Agent
            </Button>
          </AgentCreationDialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Create Agent Card */}
        <Card className="mb-8 border-2 border-dashed border-muted-foreground/25">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bot className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Create Your First AI Agent</h3>
            <p className="text-muted-foreground mb-4 text-center max-w-md">
              Build conversational AI agents with custom avatars, knowledge bases, and personalities to handle customer interactions.
            </p>
            <AgentCreationDialog>
              <Button variant="blue" size="lg" className="gap-2">
                <Plus className="w-4 h-4" />
                Create Agent
              </Button>
            </AgentCreationDialog>
          </CardContent>
        </Card>

        {/* Agents Grid */}
        {filteredAgents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                        <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                          {agent.status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{agent.description}</CardDescription>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{agent.conversations} conversations</span>
                    </div>
                    <span>Created {agent.created}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredAgents.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No agents found matching your search.</p>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-6 text-center">Agent Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Custom Avatars</CardTitle>
                <CardDescription>
                  Use realistic AI avatars that represent your brand and personality
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Natural Conversations</CardTitle>
                <CardDescription>
                  Engage in human-like conversations with advanced language understanding
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-primary" />
                <CardTitle>Knowledge Integration</CardTitle>
                <CardDescription>
                  Connect your data sources and documentation for informed responses
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}