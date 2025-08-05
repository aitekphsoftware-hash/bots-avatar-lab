import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Video, MessageCircle, Languages, ArrowRight, Play, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="border-b bg-white px-6 py-4">
        <h1 className="text-2xl font-semibold">Home</h1>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Welcome to BotsRHere</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create lifelike AI avatars, generate professional videos, and build intelligent conversational agents with our cutting-edge AI technology.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/avatars">
                <Button variant="darkBlue" size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Link to="/avatars">
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <Users className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle>Create Avatar</CardTitle>
                  <CardDescription>Design your perfect AI avatar in minutes</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/video-studio">
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <Video className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle>Video Studio</CardTitle>
                  <CardDescription>Create professional videos with AI avatars</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/video-translate">
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <Languages className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle>Video Translate</CardTitle>
                  <CardDescription>Translate videos to 100+ languages</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/agents">
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20">
                <CardHeader className="text-center">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform" />
                  <CardTitle>AI Agents</CardTitle>
                  <CardDescription>Build intelligent conversational bots</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Play className="w-16 h-16 text-primary" />
              </div>
              <CardHeader>
                <CardTitle>Instant Video Creation</CardTitle>
                <CardDescription>
                  Transform text into professional videos with lifelike AI avatars. No filming, no actors, no studio required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/video-studio">
                  <Button className="gap-2">
                    Try Video Studio
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                <Upload className="w-16 h-16 text-orange-500" />
              </div>
              <CardHeader>
                <CardTitle>Custom Avatar Creation</CardTitle>
                <CardDescription>
                  Upload a photo and create your personalized AI avatar that looks and speaks just like you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/avatars">
                  <Button variant="orange" className="gap-2">
                    Create Avatar
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-6">Trusted by Creators Worldwide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">10M+</div>
                <div className="text-muted-foreground">Videos Created</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">150+</div>
                <div className="text-muted-foreground">Languages Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">99%</div>
                <div className="text-muted-foreground">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}