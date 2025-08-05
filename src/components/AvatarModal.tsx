import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, Smartphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Presenter {
  presenter_id: string;
  name: string;
  gender: string;
  preview_url: string;
  talking_preview_url: string;
  thumbnail_url: string;
  voice?: {
    type: string;
    voice_id: string;
  };
}

interface Voice {
  voice_id: string;
  name: string;
  gender: string;
  language: string;
  preview_url?: string;
}

interface PreviewUrl {
  id: string;
  title: string;
  url: string;
  description?: string;
}

interface AvatarModalProps {
  presenter: Presenter;
  children: React.ReactNode;
}

const cleanAvatarName = (name: string) => {
  // Remove everything after @ symbol and any version prefixes
  return name.replace(/^v\d+_public_/, "").split("@")[0].replace(/_/g, " ");
};

const AvatarModal = ({ presenter, children }: AvatarModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [previewUrls, setPreviewUrls] = useState<PreviewUrl[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [loadingUrls, setLoadingUrls] = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const fetchVoices = async () => {
    setLoadingVoices(true);
    try {
      console.log("Fetching voices from D-ID API...");
      const response = await fetch("https://api.d-id.com/clips/voices", {
        headers: {
          "accept": "application/json",
          "authorization": "Basic Y29kZXh4eGhvc3RAZ21haWwuY29t:259e8IoCoDHpSrJ_Qwe9n"
        }
      });
      
      console.log("Voices API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Voices API response data:", data);
        setVoices(data.voices || []);
        console.log("Voices set:", data.voices?.length || 0, "voices");
      } else {
        const errorData = await response.text();
        console.error("Voices API error:", response.status, errorData);
      }
    } catch (error) {
      console.error("Failed to fetch voices:", error);
    } finally {
      setLoadingVoices(false);
    }
  };

  const fetchPreviewUrls = async () => {
    setLoadingUrls(true);
    try {
      const { data, error } = await supabase
        .from('preview_urls')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPreviewUrls(data || []);
    } catch (error) {
      console.error("Failed to fetch preview URLs:", error);
    } finally {
      setLoadingUrls(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchVoices();
      fetchPreviewUrls();
    }
  }, [isOpen]);

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const playVoiceSample = (voiceId: string, previewUrl?: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
      return;
    }

    if (previewUrl) {
      const audio = new Audio(previewUrl);
      setPlayingVoice(voiceId);
      
      audio.onended = () => setPlayingVoice(null);
      audio.onerror = () => setPlayingVoice(null);
      
      audio.play().catch(() => setPlayingVoice(null));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full h-[90vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-4">
              <img 
                src={presenter.thumbnail_url} 
                alt={cleanAvatarName(presenter.name)}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{cleanAvatarName(presenter.name)}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={presenter.gender === "male" ? "default" : "secondary"}>
                    {presenter.gender}
                  </Badge>
                  {presenter.voice && (
                    <Badge variant="outline">
                      {presenter.voice.type} voice
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex">
            {/* Video Preview - Left Side */}
            <div className="w-1/2 p-6 border-r">
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  src={presenter.talking_preview_url}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  onPlay={handleVideoPlay}
                  onPause={handleVideoPause}
                />
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                  <span className="text-sm">Avatar Preview</span>
                </div>
              </div>
            </div>

            {/* Tabs - Right Side */}
            <div className="w-1/2 flex flex-col">
              <Tabs defaultValue="voices" className="flex-1 flex flex-col">
                <TabsList className="mx-6 mt-6 grid w-auto grid-cols-2">
                  <TabsTrigger value="voices" className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Voices
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-hidden">
                  <TabsContent value="voices" className="h-full m-0 p-6">
                    <div className="h-full overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-4">Available Voices</h3>
                      {loadingVoices ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {voices.length > 0 ? (
                            voices.map((voice) => (
                              <Card key={voice.voice_id} className="transition-all hover:shadow-md">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium">{voice.name}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {voice.gender}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                          {voice.language}
                                        </Badge>
                                      </div>
                                    </div>
                                    {voice.preview_url && (
                                      <Button
                                        size="sm"
                                        variant={playingVoice === voice.voice_id ? "default" : "outline"}
                                        onClick={() => playVoiceSample(voice.voice_id, voice.preview_url)}
                                        className="ml-3"
                                      >
                                        {playingVoice === voice.voice_id ? (
                                          <>
                                            <Pause className="w-4 h-4 mr-1" />
                                            Playing
                                          </>
                                        ) : (
                                          <>
                                            <Play className="w-4 h-4 mr-1" />
                                            Play
                                          </>
                                        )}
                                      </Button>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                              <Volume2 className="w-12 h-12 text-muted-foreground mb-4" />
                              <h4 className="text-lg font-medium mb-2">No Voices Available</h4>
                              <p className="text-sm text-muted-foreground mb-4">
                                Voices could not be loaded from the D-ID API. This might be due to API limitations or authentication issues.
                              </p>
                              <Button variant="outline" onClick={fetchVoices}>
                                Try Again
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="h-full m-0 p-6">
                    <div className="h-full overflow-y-auto">
                      <h3 className="text-lg font-semibold mb-4">Mobile Previews</h3>
                      {loadingUrls ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {previewUrls.map((preview) => (
                            <Card key={preview.id} className="overflow-hidden">
                              <CardContent className="p-4">
                                <div className="text-center mb-3">
                                  <h4 className="font-medium text-sm">{preview.title}</h4>
                                  {preview.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{preview.description}</p>
                                  )}
                                </div>
                                {/* iPhone 14 Mockup */}
                                <div className="relative mx-auto" style={{ width: "150px", height: "300px" }}>
                                  {/* iPhone Frame */}
                                  <div className="absolute inset-0 bg-black rounded-[25px] p-2">
                                    <div className="w-full h-full bg-white rounded-[20px] overflow-hidden relative">
                                      {/* Notch */}
                                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-black rounded-b-xl z-10"></div>
                                      {/* Screen Content */}
                                      <iframe
                                        src={preview.url}
                                        className="w-full h-full border-0"
                                        style={{
                                          transform: "scale(0.35)",
                                          transformOrigin: "top left",
                                          width: "285%",
                                          height: "285%"
                                        }}
                                        title={preview.title}
                                        sandbox="allow-scripts allow-same-origin"
                                      />
                                    </div>
                                  </div>
                                  {/* Home Indicator */}
                                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gray-400 rounded-full"></div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarModal;